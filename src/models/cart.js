const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema(
    {
        book_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Book',
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

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart