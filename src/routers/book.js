const express = require('express')
const Book = require('../models/book')
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')
const ObjectID = require('mongodb').ObjectID


router.post('/books', auth, async (req, res) => {
    const book = new Book({
        ...req.body,
        owner: req.user._id,
    })

    try {
        const role = req.user.role
        if(role == 1){
            await book.save()
            res.status(201).send(book)
        }
        res.status(403).json({
            success: false,
            message: `${req.user._id} don't have permission`
        })
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/books', async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.completed){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await Book.find( async (err, response) => {
            if(!err){
                res.status(200).send(response)
            } else {
                res.status(500).send(err)
            }
        })
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/search-books', async (req, res) => {
    const searchQuery = req.query.search
    console.log(searchQuery)
    const sort = {}

    // if(req.query.search){
    //     const parts = req.query.sortBy.split(':')
    //     sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    // }

    try {
        await Book.find({name: {$regex: searchQuery}}, async (err, response) => {
            if(!err){
                res.status(200).send(response)
            } else {
                res.status(500).send(err)
            }
        })
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/category-books', async (req, res) => {
    const categoryQuery = req.query.category
    console.log(searchQuery)
    const sort = {}

    // if(req.query.search){
    //     const parts = req.query.sortBy.split(':')
    //     sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    // }

    try {
        await Book.find({name: {$regex: categoryQuery}}, async (err, response) => {
            if(!err){
                res.status(200).send(response)
            } else {
                res.status(500).send(err)
            }
        })
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/filter-books', async (req, res) => {
    const categoryQuery = req.query.category
    const searchQuery = req.query.search
    console.log(categoryQuery)
    console.log(searchQuery)
    const sort = {}

    // if(req.query.search){
    //     const parts = req.query.sortBy.split(':')
    //     sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    // }

    try {
        await Book.find({name: {$regex: searchQuery}, category: {$regex: categoryQuery}}, async (err, response) => {
            if(!err){
                res.status(200).send(response)
            } else {
                res.status(500).send(err)
            }
        })
    } catch (error) {
        res.status(500).send(error)
    }
})


router.get('/book/:id', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === req.query.completed
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await Book.findById(req.params.id, async (err, response) => {
            if(!err){
                res.status(200).send(response)
            } else {
                res.status(500).send(err)
            }
        })
    } catch (error) {
        res.status(500).send(error)
    }
})


router.delete('/book/:id', auth, async (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
		 res.status(404).send();
    }
    
    try {
        await Book.findByIdAndDelete(req.params.id, async (err, response) => {
            if(!err){
                res.status(200).json({
                    message: `book id ${req.params.id} deleted`
                })
            } else {
                res.status(500).send(err)
            }
        })
    } catch (error) {
        res.status(500).send(error)
    }
})

router.put('/book/:id', auth, async (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
		 res.status(404).send();
    }
    console.log("book oke")
    const book = new Book({
        ...req.body,
    })

    try {
        await Book.findById(req.params.id, async (err, book) => {
            console.log(book)
            if(!err){
                book.name = req.body.name,
                book.category = req.body.category,
                book.price = req.body.price,
                book.description = req.body.description,
                book.stok = req.body.stok,
                book.owner = req.body.owner,
                book.image_url = req.body.image_url
                console.log(book)
                book.save(async (err, book) => {
                    if(!err){
                        res.status(200).send(book)
                    }
                    res.status(500).send(err)
                })
                res.status(201).send(book)
            } else {
                res.status(500).send(err)
            }
        })
    } catch (error) {
        res.status(500).send(error)
    }
})



module.exports = router
