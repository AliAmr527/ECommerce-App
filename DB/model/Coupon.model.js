import mongoose, { model, Schema, Types } from 'mongoose';


const couponSchema = new Schema({
    code:{type:String,required:true,unique:true,min:2,max:20},
    amountOfDiscount: { type: Number, required: true},
    noOfUses:{type:Number},
    usedBy: [{ type: Types.ObjectId, ref: 'User' }],
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    expiryDate:{type:Date,required:true,min:Date.now()}
})

const couponModel = mongoose.models.coupon || model('coupon', couponSchema)

export default couponModel