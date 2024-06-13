require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose')

const authRouter = require('./routes/auth')
const cartRouter = require('./routes/carts')
const orderRouter = require('./routes/orders')


const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ecommerceusers.rcslsip.mongodb.net/?retryWrites=true&w=majority&appName=EcommerceUsers`)

        console.log('Connected')
    }
    catch (error) {
        console.log('Error');
    }
}
connectDB()

const app =  express();
app.use(express.json());

app.get('/', (req, res) => res.send('Hello world'));

app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server start on port ${PORT}`));