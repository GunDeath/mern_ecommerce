import express from 'express'
import {getProducts} from "../controllers/products/product.controller.js";
import {
    getBrandProducts,
    getSubByBrand,
    getSubCategoryProducts,
    getCategoryProducts,
    sortProductsLow,
    sortProductsUpper
} from "../controllers/products/filter_product.controller.js";
import {protect, admin} from "../middleware/auth.middleware.js";
import {createProduct, deleteProduct, getProductById, updateProduct} from "../controllers/products/product.controller.js";

const router = express.Router()

router.get('/brand/:brand', getBrandProducts)
router.get('/filter/:brand/:subCategory', getSubByBrand)
router.get('/subcategory/:subCategory', getSubCategoryProducts)
router.get('/category/:category', getCategoryProducts)
router.get('/sortlow', sortProductsLow)
router.get('/sortupper', sortProductsUpper)

router
    .route('/')
    .get(getProducts)
    .post(protect, admin, createProduct)

router
    .route('/:id')
    .get(getProductById)
    .delete(protect, admin, deleteProduct)
    .put(protect, admin, updateProduct)

export default router