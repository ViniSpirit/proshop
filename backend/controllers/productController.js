import Product from '../models/productModel.js'
import asyncHandler from 'express-async-handler'

//@desc     Fetch all products
//@route    GET /api/products
//@acess    public
const getProducts = asyncHandler(async(request, response) => {
    const products =  await Product.find({})

    response.json(products)
})

//@desc     Fetch single product
//@route    GET /api/products/:id
//@acess    public
const getProductById = asyncHandler(async(request, response) => {
    const product = await Product.findById(request.params.id)

    if(product){
        
        response.json(product)
        
    } else {
        response.status(404)
        throw new Error('Product not found')
    }
})

export {
    getProducts,
    getProductById
}