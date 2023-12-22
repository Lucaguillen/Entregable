import { ProductManager, CartManager } from "../dao/factory.js"
import CartRepository from "../repositories/carts.repositories.js"
import ProductRepository from "../repositories/products.repositories.js"
const productManager = new ProductManager()
const cartManager = new CartManager()

const cartRepository = new CartRepository(cartManager)
const productRepository = new ProductRepository(productManager)

const getAllproducts = async (page) =>{
    const proudcts = await productRepository.productPaginate(page)
    return proudcts
}

const getCartproduct = async (cid) =>{
    const cart = await cartRepository.getCartProducts(cid)
    return cart
}

export{
    getAllproducts,
    getCartproduct
}