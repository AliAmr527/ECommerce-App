import couponModel from "../../../../DB/model/Coupon.model.js"
import { ErrorClass } from "../../../utils/errorClass.js"


export const addCoupon = async (req,res,next)=>{
    const {code,amountOfDiscount,noOfUses,expiryDate} = req.body
    const createdBy = req.user._id
    const isCouponExist = await couponModel.findOne({code})
    if(isCouponExist)return next(new ErrorClass(`This Coupon ${code} Already Exists!`,409))
    const coupon = await couponModel.create({code,amountOfDiscount,noOfUses,expiryDate,createdBy})
    return res.status(201).json({message:"Done!",coupon})
}

export const getCoupons = async (req,res,next)=>{
    const coupons = await couponModel.find().select('-_id -createdBy -__v')
    
    return res.status(200).json({message:"Done!",coupons})
}

export const deleteCoupon = async(req,res,next)=>{
    const couponId = req.params.id
    const coupon = await couponModel.findByIdAndDelete(couponId)
    if (!coupon) {
        return next(new ErrorClass('coupon not found!', 404))
    }
    return res.status(200).json({message:"Done!"})
}