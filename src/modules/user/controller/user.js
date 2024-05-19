import categoryModel from "../../../../DB/model/Category.model.js"
import productModel from "../../../../DB/model/Product.model.js"
import userModel from "../../../../DB/model/User.model.js"
import { ErrorClass } from "../../../utils/errorClass.js"


export const findUserWithInfo = async (req,res,next)=>{
    const UserId = req.user._id
    const categories = await userModel.findById(UserId).populate({
        path:"category brand subcategory",
        select:"name"
    })
    return res.status(200).json({message:"Done!",categories})
}

export const addToFavorites = async (req,res,next)=>{
    const {productId} = req.body
    const product = await productModel.findById(productId)
    if(!product){
        return new(new ErrorClass("product not found",404))
    }
    const user = await userModel.findOneAndUpdate({_id:req.user._id},{
        $addToSet:{
            favorites:productId
        }
    },{new:true})

    return res.status(418).json({mesage:"Done!",user})
}

export const getFavorites = async (req, res, next) => {
    // let favorites = req.user.favorites
    const user = await userModel.findById(req.user._id).populate('favorites')
    user.favorites = user.favorites.filter(ele => {
        if (ele) {
            return ele
        }
    })

    return res.status(200).json({ message: "Done!", favorites:user.favorites })
}