import { nanoid } from "nanoid"
import userModel from "../../../../DB/model/User.model.js"
import cloudinary from "../../../utils/cloudinary.js"
import { createHtml, sendEmail } from "../../../utils/email.js"
import { ErrorClass } from "../../../utils/errorClass.js"
import bcrypt from "bcryptjs"
import crypto from "crypto-js"
import jwt from "jsonwebtoken"
import cartModel from "../../../../DB/model/Cart.model.js"

export const signUp = async (req, res, next) => {
    const isEmailExist = await userModel.findOne({ email: req.body.email })
    if (isEmailExist) {
        return next(new ErrorClass(`this email ${req.body.email} already exists!`, 409))
    }
    //hashing password
    req.body.password = bcrypt.hashSync(req.body.password, -process.env.SALT_ROUND)
    //encrypting phone number
    req.body.phone = crypto.AES.encrypt(req.body.phone, process.env.ENCRYPTION_KEY).toString()
    //setting a unique identifier for folder name in cloudinary
    const folderName = nanoid(6)
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
        { folder: `${cloudinaryFolder}/users/${folderName}` })
    req.body.image = { secure_url, public_id }
    req.body.code = nanoid(6)
    const html = createHtml("Email Confirmation", "confirm your email address", req.body.code)

    sendEmail({ to: req.body.email, subject: "confirm your account", html: html })
    const user = await userModel.create(req.body)
    await cartModel.create({
        userId: user._id
    })
    return user ? res.status(201).json({ message: "Done!" }) : next(new ErrorClass("failed to create user!", 422))
}

export const confirmEmail = async (req, res, next) => {
    const user = await userModel.findOne({ email: req.body.email })
    if (!user) {
        return next(new ErrorClass("This user doesn't exist!", 404))
    }
    if (user.confirmEmail) {
        return next(new ErrorClass("This email is already confirmed!", 409))
    }
    if (req.body.code != user.code) {
        return next(new ErrorClass("code doesnt match!", 401))
    }
    //putting another code that i dont tell the user so he doesnt exploit other endpoints
    const code = nanoid(6)
    await userModel.updateOne({ email: req.body.email }, { confirmEmail: true, code: code })
    return res.status(200).json({ message: "Done!" })
}

export const signIn = async (req, res, next) => {
    const { email, password } = req.body
    const isEmailExist = await userModel.findOne({ email: email })
    if (!isEmailExist) return next(new ErrorClass("invalid user credentials!", 401))
    if (!isEmailExist.confirmEmail) return next(new ErrorClass("you haven't confirmed your email yet!", 401))
    const match = bcrypt.compareSync(password, isEmailExist.password)
    if (!match) return next(new ErrorClass("invalid user credentials!", 401))

    const payload = {
        id: isEmailExist._id
    }
    const token = jwt.sign(payload, process.env.TOKEN_SIGNATURE,{expiresIn:'2h'})
    return res.status(200).json({ message: "Done!", token: token })
}

export const sendCode = async (req, res, next) => {
    const { email } = req.body
    const isEmailExist = await userModel.findOne({ email: email })
    if (!isEmailExist) return next(new ErrorClass("invalid user credentials!", 401))
    const code = nanoid(6)
    const html = createHtml("Change your password", "change your password", code)

    sendEmail({ to: req.body.email, subject: "Change your Password", html: html })

    await userModel.updateOne({ email }, { code })
    res.status(200).json({ message: "Done!" })
}

export const resetPassword = async (req, res, next) => {
    let { email, code, password } = req.body
    const isEmailExist = await userModel.findOne({ email: email })
    if (!isEmailExist) return next(new ErrorClass("invalid user credentials!", 401))

    if (isEmailExist.code != code) return next(new ErrorClass("In-Valid code", 401))

    password = bcrypt.hashSync(password, -process.env.SALT_ROUND)
    code = nanoid(6)
    await userModel.updateOne({ email }, { password, code })
    return res.status(200).json({ message: "Done!" })
}

