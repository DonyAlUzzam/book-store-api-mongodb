const express = require('express')
require('./db/mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const port = 4000

const userRouter = require('./routers/user')
const bookRouter = require('./routers/book')
const cartRouter = require('./routers/cart')
const orderRouter = require('./routers/order')

app.use(bodyParser.json({limit:'50mb'}))
app.use(bodyParser.urlencoded({extended:true, limit:'50mb'}));

app.use(express.json())
app.use(cors())
app.use(userRouter)
app.use(bookRouter)
app.use(cartRouter)
app.use(orderRouter)

app.listen(port, () => {
  console.log(`Server is running in ${port}`)
})
