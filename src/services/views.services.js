import { ProductManager, CartManager, usersManager  } from "../dao/factory.js"
import CartRepository from "../repositories/carts.repositories.js"
import ProductRepository from "../repositories/products.repositories.js"
import UserRepository from "../repositories/users.repositories.js"
 
const productManager = new ProductManager()
const cartManager = new CartManager()
const userManager = new usersManager()

const cartRepository = new CartRepository(cartManager)
const productRepository = new ProductRepository(productManager)
const userRepository = new UserRepository(userManager)

const getAllproducts = async (page) =>{
    const proudcts = await productRepository.productPaginate(page)
    return proudcts
}

const getCartproduct = async (cid) =>{
    const cart = await cartRepository.getCartProducts(cid)
    return cart
}

//
const getAllUsers = async (page) =>{
    const users = await userRepository.usersPaginate(page)
    return users
}


export{
    getAllproducts,
    getCartproduct,
    getAllUsers
}