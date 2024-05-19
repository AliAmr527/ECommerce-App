import mongoose, { model, Schema, Types } from 'mongoose';


const categorySchema = new Schema({
    name: { type: String, required: true, unique: true, lowercase: true },
    slug: { type: String, required: true, lowercase: true },
    image: { type: Object },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        id: false
    })

categorySchema.virtual("subcategory", {
    localField: '_id',
    foreignField: 'categoryId',
    ref: 'subcategory'
})

const categoryModel = mongoose.models.Category || model('Category', categorySchema)

export default categoryModel