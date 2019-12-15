const express = require('express')
const Cart = require('../models/cart')
const Book = require('../models/book')
const auth = require('../middleware/auth')
const router = new express.Router()
const ObjectID = require('mongodb').ObjectID

router.post('/carts', auth, async (req, res) => {
    const cart = new Cart({
        ...req.body,
        owner: req.user._id,
    })

    try {
        await cart.save()
        res.status(201).send(cart)
    } catch (error) {
        res.status(500).send(error)
    }
})

// router.post('/carts', auth, async (req, res) => {
//     const cart = new Cart({
//         owner: req.user._id,
//         ...req.body,
//     })

//     try {
//         await cart.save()
//         res.status(201).send(cart)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

router.get('/carts', auth, async (req, res) => {
    try {
        await Cart.aggregate([
            {
                $match:{
                    owner:req.user._id
                }
            },
            { 
                $lookup: { 
                    from: "books",
                    localField: "book_id", 
                    foreignField: "_id", 
                    as: "dataOrders "
                }
            }
        ], async (err, response) => {
            if(err){
                res.status(500).send(err)
            } else {
                res.status(200).send(response)
                // console.log(typeof(response))
            }
        })
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/cart/:id', auth, async (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
        res.status(404).send({data : "ID not Found!"})
    }
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
        
        await Cart.aggregate([
            {
                $match:{
                   _id: ObjectID(req.params.id),
                   owner: req.user._id
                }
            },
            { 
                $lookup: { 
                    from: "books",
                    localField: "book_id", 
                    foreignField: "_id", 
                    as: "dataOrders "
                }
            }
        ], async (err, response) => {
            if(err){
                res.status(500).send(err)
            } else {
                res.status(200).send(response)
                console.log(response)
            }
        })
    } catch (error) {
        res.status(500).send(error)
    }
})


router.put('/cart/:id', auth, async (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
        res.status(404).send({data : "ID not Found!"})
    }
    const cart = new Cart({
        ...req.body,
    })

    try {
        await Cart.findById(req.params.id, async (err, cart) => {
            if(!err){
                cart.qty = req.body.qty
                cart.save(async (err, cart) => {
                    if(!err){
                        res.status(200).send(cart)
                    }
                    res.status(500).send(err)
                })
                res.status(201).send(cart)
            } else {
                res.status(500).send(err)
            }
        })
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/cart/:id', auth, async (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
		 res.status(404).send();
    }
    
    try {
        await Cart.findByIdAndDelete(req.params.id, async (err, response) => {
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

module.exports = router