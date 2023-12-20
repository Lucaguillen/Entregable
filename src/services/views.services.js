import { ProductManager, CartManager } from "../dao/factory.js"
const productManager = new ProductManager()
const cartManager = new CartManager()

const getAllproducts = async (page) =>{
    const proudcts = await productManager.productPaginate(page)
    return proudcts
}

const getCartproduct = async (cid) =>{
    const cart = await cartManager.getCartProducts(cid)
    return cart
}

export{
    getAllproducts,
    getCartproduct
}