import {createHash, generateToken, isValidPassword} from "../utils.js"
import { usersManager, CartManager} from "../dao/factory.js"
const cartManager = new CartManager()
const usermanager = new usersManager()
import config from "../../config.js";
import UserRepository from "../repositories/users.repositories.js";
import CartRepository from "../repositories/carts.repositories.js";

const userRepository = new UserRepository(usermanager)
const cartRepository = new CartRepository(cartManager)

const findByEmailService = async  (email) => {
    const user = await userRepository.findByEmail(email)
    return user
}

const nonSensitiveService = async (email) =>{
    const user = await userRepository.nonSensitiveUserInfo(email)
    return user
}

const registerService  = async  (user, email, password) =>{

    let passwordHashed = createHash(password)
    user.password = passwordHashed
    
    if(email === config.adminEmail && password === config.adminPass){
        user.role = "admin"
    }
    
    const result = await userRepository.create(user)

    const newCart = {productsCart: []};
    const createCart = await cartRepository.createCart(newCart)
    const setCart = await userRepository.setCartToUser(createCart, result._id)
}
export{
    findByEmailService,
    registerService,
    nonSensitiveService
}