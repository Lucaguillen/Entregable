import {createHash, generateToken, isValidPassword} from "../utils.js"
import { usersManager, CartManager} from "../dao/factory.js"
const cartManager = new CartManager()
const usermanager = new usersManager()
import config from "../../config.js";

const findByEmailService = async  (email) => {
    const user = await usermanager.findByEmail(email)
    return user
}

const registerService  = async  (user, email, password) =>{

    let passwordHashed = createHash(password)
    user.password = passwordHashed
    
    if(email === config.adminEmail && password === config.adminPass){
        user.role = "admin"
    }
    
    const result = await usermanager.create(user);

    const newCart = {productsCart: []};
    const createCart = await cartManager.createCart(newCart)
    const setCart = await usermanager.setCartToUser(createCart, result._id)
}
export{
    findByEmailService,
    registerService
}