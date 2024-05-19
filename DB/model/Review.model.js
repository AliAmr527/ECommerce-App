import mongoose, { model, Schema, Types } from 'mongoose';


const reviewSchema = new Schema({
    productId: { type: Types.ObjectId, ref: 'product', required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true, min: 0, max: 10 },
})

const reviewModel = mongoose.models.review || model('review', reviewSchema)

export default reviewModel