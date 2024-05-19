import { Schema, Types, model } from "mongoose";


const userSchema = new Schema({

    userName: {
        type: String,
        required: [true, 'userName is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char']

    },
    email: {
        type: String,
        unique: [true, 'email must be unique value'],
        required: [true, 'email is required'],
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    phone: {
        type: String,
    },
    role: {
        type: String,
        default: 'User',
        enum: ['User', 'Admin']
    },

    status: {
        type: Boolean,
        default: false, //false equals active and not blocked
    },
    confirmEmail: {
        type: Boolean,
        default: false,
    },
    
    image: {
        type:Object
    },
    code:{
        type:String,
        min:[6,"length must be 6"],
        max:[6,"length must be 6"]
    },
    DoB: Date,
    favorites:[{
        type:Types.ObjectId,
        ref:"product"
    }]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id:false,
    timestamps:true
})

userSchema.virtual("subcategory", {
    localField: '_id',
    foreignField: 'createdBy',
    ref: 'subcategory'
})

userSchema.virtual("category", {
    localField: '_id',
    foreignField: 'createdBy',
    ref: 'Category'
})

userSchema.virtual("brand", {
    localField: '_id',
    foreignField: 'createdBy',
    ref: 'brand'
})

userSchema.virtual("product", {
    localField: '_id',
    foreignField: 'createdBy',
    ref: 'product'
})



const userModel = model('User', userSchema)
export default userModel