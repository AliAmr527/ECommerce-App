import jwt from "jsonwebtoken";
import userModel from "../../DB/model/User.model.js";
import { ErrorClass } from "../utils/errorClass.js";

export const roles = {
    admin: "Admin",
    user: "User"
}

Object.freeze(roles) //makes this object read only
const auth = (roles = []) => {
    return async (req, res, next) => {
        try {
            const { authorization } = req.headers;
            if(!authorization){
                return next(new ErrorClass("Token is needed", 498))
            }
            if (!authorization?.startsWith(process.env.BEARER_KEY)) {
                return next(new ErrorClass("In-valid bearer key", 498))
            }
            const token = authorization.split(process.env.BEARER_KEY)[1]
            if (!token) {
                return next(new ErrorClass("In-valid token", 498))
            }
            const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE)
            if (!decoded?.id) {
                return next(new ErrorClass("In-valid token payload", 404))
            }
            const authUser = await userModel.findById(decoded.id).select('-password')
            if (!authUser) {
                return next(new ErrorClass("Not registered account", 404))
            }
            if (!authUser.confirmEmail) {
                return next(new ErrorClass("Confirm your email first!", 401))
            }
            if (!roles.includes(authUser.role)) {
                return next(new ErrorClass("you're not authorized to access this endpoint", 403))
            }
            req.user = authUser;
            return next()
        } catch (error) {
            return res.json({ message: "Catch error", err: error?.message })
        }
    }
}

export default auth