const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/users', async (req, res) => {
  const user = new User({
    ...req.body,
    fullname: req.body.first_name +' '+ req.body.last_name,
  })

  try {
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
    console.log(token)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find({})
    res.status(200).send(users)
  } catch (e) {
    res.status(500).send()
  }
})


router.get('/allusers', auth, async (req, res) => {
  try {
    const users = await User.find({role: 0})
    res.status(200).send(users)
  } catch (e) {
    res.status(500).send()
  }
})


router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})

router.get('/users/get-token', auth, async (req, res) => {
  res.send({ token: req.token })
})

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password, req.body.role)
    const token = await user.generateAuthToken()
    res.status(200).send({ user, token })
  } catch (e) {
    res.status(422).send({
      message: 'Login Failed',
    })
  }
})

router.post('/users/login/admin', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password, req.body.role)
    const token = await user.generateAuthToken()
    res.status(200).send({ user, token })
  } catch (e) {
    res.status(422).send({
      message: 'Login Failed',
    })
  }
})

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token
    })
    await req.user.save()

    res.send({ message: 'Logout Success' })
  } catch (e) {
    res.status(500).send({ message: 'Logout Failed' })
  }
})

router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove()
    res.send(req.user)
  } catch (e) {
    res.status(500).send({ message: 'Delete Failed' })
  }
})


module.exports = router
