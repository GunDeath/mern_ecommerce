import express from 'express'
import path from 'path'
import morgan from 'morgan'
import dotenv from 'dotenv'
import connectDB from "./config/db.js";
import bodyParser from 'body-parser'

import productRoutes from './routes/product.routes.js'
import userRoutes from './routes/user.routes.js'
import orderRoutes from './routes/order.routes.js'

dotenv.config()

connectDB()

const app = express();

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use(bodyParser.json())

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)

app.get('/', (req, res) => {
    res.send('hello222!')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server has start at port: ${PORT}`)
})
