import mongoose, { model, Schema, Types } from 'mongoose';


const brandSchema = new Schema({
    name: { type: String, required: true, unique: true, lowercase: true },
    slug: { type: String, required: true, lowercase: true },
    image: { type: Object },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
})

const brandModel = mongoose.models.brand || model('brand', brandSchema)

export default brandModel