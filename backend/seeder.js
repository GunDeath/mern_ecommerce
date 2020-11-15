import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from "./models/user.model.js";
import Product from "./models/product.model.js";
import connectDB from "./config/db.js";
import pnb from './data/pnb.js'
import users from './data/users.js'

dotenv.config()

connectDB();

const importData = async () => {
    try{
        await Product.deleteMany()
        await User.deleteMany()

        const createdUsers = await User.insertMany(users)

        const adminUser = createdUsers[0]._id

        const sampleProducts = pnb.map((product) => {
            return { ...product, user: adminUser }
        })

        await Product.insertMany(sampleProducts)

        console.log('Data Imported!')
        process.exit()
    }catch (err){
        console.log(`${err}`);
        process.exit(1)
    }
}

const destroyData = async () => {
    try{
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        console.log(`Data Destroyed!`.red.inverse);
        process.exit();
    }catch (err){
        console.log(`${err}`.red.inverse);
        process.exit(1)
    }
}

if(process.argv[2] === '-d'){
    destroyData()
}else {
    importData();
}