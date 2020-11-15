import asyncHandler from "express-async-handler";
import Order from "../models/order.model.js";
import Anonuser from "../models/anon.user.model.js";
import crypto from 'crypto'
import axios from 'axios'
import generateToken from "../utils/generateToken.js";


const addOrderItems = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, userInfo, paymentMethod,
        itemsPrice, shippingPrice, totalPrice } = req.body

    const anonUserExist = await Anonuser.findOne({email : userInfo.email})

    if(orderItems && orderItems === 0){
        res.status(400)
        throw new Error(`No order items`)
    }else {
        if(req.user){
            const order = new Order({
                orderItems, user: req.user._id, shippingAddress,
                userInfo, paymentMethod, itemsPrice, shippingPrice,
                totalPrice })

            const createOrder = await order.save()
            res.status(201).json(createOrder);
        }else{
            if(anonUserExist){
                const order = new Order({
                    orderItems, shippingAddress, userInfo,
                    paymentMethod, itemsPrice, shippingPrice,
                    totalPrice, userToken: generateToken(anonUserExist._id)
                })

                const createOrder = await order.save()
                res.status(201).json(createOrder);
            }else if(!anonUserExist){
                const newAnonUser = await Anonuser.create({
                    name: userInfo.name, surname: userInfo.surname,
                    patronymic: userInfo.patronymic, email: userInfo.email, })

                const order = new Order({
                    orderItems, shippingAddress, userInfo,
                    paymentMethod, itemsPrice, shippingPrice,
                    totalPrice, userToken: generateToken(newAnonUser._id)
                })

                const createOrder = await order.save()
                res.status(201).json(createOrder);
            }
        }
    }
})

const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    )
    if (order) {
        let stringWayForPay = '';
        let itemsArrayName = [];
        let itemsArrayQty = [];
        let itemsArrayPrice = [];
        order.orderItems.map(item => {
            itemsArrayName.push(item.name)
            itemsArrayQty.push(item.qty)
            itemsArrayPrice.push(item.price)
        })

        stringWayForPay = `freelance_user_5fabc3de26e9a;www.komilfonails.shop;${order.id};${Date.now()};${order.totalPrice};USD;${itemsArrayName.join(';').toString()};${itemsArrayQty.join(';').toString()};${itemsArrayPrice.join(';').toString()}`

        let hmac2 = crypto.createHmac('md5', 'b69aa1977caf0c21ee6bd0477b720f775a57af8c');
        let data2 = hmac2.update(stringWayForPay);
        let gen_hmac = data2.digest('hex');

        const orderObject =
            {
                "transactionType":"CREATE_INVOICE",
                "merchantAccount":"freelance_user_5fabc3de26e9a",
                "merchantDomainName":"www.komilfonails.shop",
                "merchantSignature":`${gen_hmac}`,
                "apiVersion":1,
                "language":"ru",
                "serviceUrl":"http://komilfonails.shop",
                "orderReference":`${order.id}`,
                "orderDate": Date.now(),
                "amount":`${order.totalPrice}`,
                "currency":"USD",
                "orderTimeout": 86400,
                "productName":itemsArrayName,
                "productPrice":itemsArrayPrice,
                "productCount":itemsArrayQty
            }


        const { data } = await axios.post('https://api.wayforpay.com/api', orderObject)
        if(data.invoiceUrl){
            order.paymentUrl = data.invoiceUrl
            const updateOrder = await order.save()
            res.json(updateOrder)
            res.send(updateOrder)
        }else {
            order.paymentUrl = 'Not'
            const updateOrder = await order.save()
            res.json(updateOrder)
        }

    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        }

        const updatedOrder = await order.save()

        res.json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (order) {
        order.isDelivered = true
        order.deliveredAt = Date.now()

        const updatedOrder = await order.save()

        res.json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
    res.json(orders)
})

const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name')
    res.json(orders)
})

export {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders
}
