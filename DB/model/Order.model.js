import mongoose, { model, Schema, Types } from 'mongoose';


const orderSchema = new Schema({
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    address: { type: String, required: true },
    products: [{
        product: {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            paymentPrice: { type: Number, required: true },
            productId: { type: Types.ObjectId, required: true, ref: 'product' }
        },
        quantity: { type: Number, required: true, default: 1 },
    }],
    phone: { type: String, required: true },
    note: String,
    coupon: { type: Types.ObjectId, ref: 'coupon' },//maybe do it as an array to allow multiple coupons to be added *future feature*
    orderPrice: { type: Number, required: true },
    orderPaymentPrice: { type: Number, required: true },
    orderPaymentMethod: { type: String, enum: ['cash', 'card'], default: 'cash' },
    status: {
        type: String,
        enum: ['pending', 'shipped', 'placed', 'canceled', 'delivered', 'rejected', 'refunded'],
        default: 'placed',
    },
    reason: String
})

const orderModel = mongoose.models.order || model('order', orderSchema)

export default orderModel