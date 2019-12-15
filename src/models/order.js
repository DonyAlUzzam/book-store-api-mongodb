const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
    {
        cart_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Cart',
        },
        book_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Cart',
        },
        book_owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'book',
        },
        qty: {
            type: Number,
            required: true,
            trim: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
    },
    {
        timestamps: true,
    }
)

const Order = mongoose.model('Order', orderSchema)

module.exports = Order