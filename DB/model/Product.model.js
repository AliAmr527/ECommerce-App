import mongoose, { model, Schema, Types } from 'mongoose';


const productSchema = new Schema({
    name: { type: String, required: true, unique: true, lowercase: true },
    slug: { type: String, required: true, lowercase: true },
    description: { type: String, required: true, lowercase: true },
    stock: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    paymentPrice: { type: Number },
    color: { type: Array, required: false },
    size: { type: Array, required: false },
    image: { type: Object, required: true },
    coverImage: {
        type: Array
    },
    categoryId: { type: Types.ObjectId, ref: 'Category', required: true },
    subcategoryId: { type: Types.ObjectId, ref: 'subcategory', required: true },
    brandId: { type: Types.ObjectId, ref: 'brand', required: true },
    avgRate: { type: Number, default: 0 },
    rateNo:{type:Number,default:0},
    soldItems: { type: Number, default: 0 },
    QrCode:{type:String,required:true},
    createdBy:{ type: Types.ObjectId, ref: 'User', required: true },
    wishList:[{type: Types.ObjectId, ref: 'User'}]
})



const productModel = mongoose.models.product || model('product', productSchema)

export default productModel