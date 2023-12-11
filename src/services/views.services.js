import CartManager from "../dao/memoryManager/cart.manager.js"
import ProductManager from "../dao/dbManagers/products.manager.js"
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