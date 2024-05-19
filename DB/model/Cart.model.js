import mongoose, { model, Schema, Types } from 'mongoose';


const cartSchema = new Schema({
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    products:[{
        productId:{type:Types.ObjectId,required:true,ref:'product'},
        quantity:{type:Number,required:true,default:1},
    }]
})

const cartModel = mongoose.models.cart || model('cart', cartSchema)

export default cartModel