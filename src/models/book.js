const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema(
    {       
       name: {
           type: String,
           required: true,
           trim: true,
       },
       description: {
           type: String,
           required: true,
           trim: true,
       },
       category: {
           type: String,
           required: true,
           trim: true,
       },
       stok: {
           type: Number,
           required: true,
           trim: true,
       },
       price: {
           type: Number,
           required: true,
           trim: true,
       },
       image_url: {
           type: String,
        //    required: true,
           trim: true,
       },
       owner: {
           type: mongoose.Schema.Types.ObjectId,
           required: true,
           ref: 'User',
       },   
    },
    {
        timestamps: true,
    }
)

const Book = mongoose.model('Book', bookSchema)

module.exports = Book