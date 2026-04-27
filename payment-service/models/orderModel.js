import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    customerEmail: { type: String, required: true},
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    items: [{
        name: String,
        quantity: Number,
        priceInCents: Number,
        image: String
    }],
    address: {
        line1: String,
        line2: String,
        city: String,
        state: String,
        postal_code: String,
        country: String
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'completed', 'cancelled'],
        default: 'pending'
    },
    deliveryStatus: {
        type: String,
        enum: ['not_started', 'preparing', 'ready', 'out_for_delivery', 'delivered'],
        default: 'not_started'
    },
    totalPrice: { type: Number }
}, { timestamps: true })

export default mongoose.model('Order', orderSchema);