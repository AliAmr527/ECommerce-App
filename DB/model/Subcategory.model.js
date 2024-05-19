import mongoose, { model, Schema, Types } from 'mongoose';


const subcategorySchema = new Schema({
    name: { type: String, required: true, unique: true, lowercase: true }, //remove comment if subcategories names has to be unique
    slug: { type: String, required: true, lowercase: true },
    image: { type: Object },
    createdBy: { type: Types.ObjectId, ref: 'User', required: false },
    categoryId: { type: Types.ObjectId, ref: 'Category', required: true }
})

const subcategoryModel = mongoose.models.subcategory || model('subcategory', subcategorySchema)

export default subcategoryModel