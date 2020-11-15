import asyncHandler from 'express-async-handler'
import Product from '../../models/product.model.js'

const sortProductsLow = asyncHandler( async (req, res) => {
    const products = await Product.find({}).sort({price: 1})
    if(products){
        res.json(products)
    }else{
        res.status(404);
        throw new Error(`Products not found`)
    }
})

const sortProductsUpper = asyncHandler( async (req, res) => {
    const products = await Product.find({}).sort({price: -1})
    if(products){
        res.json(products)
    }else{
        res.status(404);
        throw new Error(`Products not found`)
    }
})

const getBrandProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ brand: req.params.brand})
    res.json(products)
})

const getCategoryProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ category: req.params.category})
    res.json(products)
})

const getSubCategoryProducts = asyncHandler( async (req, res) => {
    const products = await Product.find({subCategory: req.params.subCategory})
    res.json(products)
})

const getSubByBrand = asyncHandler(async (req, res) => {
    try{
        const products = await Product.find({brand: req.params.brand, subCategory: req.params.subCategory})
        res.json(products);
    }catch (error){
        res.status(400).json(error)
    }
})

export {
    getBrandProducts,
    getCategoryProducts,
    getSubCategoryProducts,
    sortProductsLow,
    sortProductsUpper,
    getSubByBrand
}
