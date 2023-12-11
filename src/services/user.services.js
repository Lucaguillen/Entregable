import {createHash, generateToken, isValidPassword} from "../utils.js"
import usersManager from "../dao/memoryManager/users.manager.js";
import CartManager from "../dao/memoryManager/cart.manager.js"
const cartManager = new CartManager()
const usermanager = new usersManager()

const findByEmailService = async  (email) => {
    const user = await usermanager.findByEmail(email)
    return user
}

const registerService  = async  (user, email, password) =>{

    let passwordHashed = createHash(password)
    user.password = passwordHashed
    
    if(email === "adminCoder@coder.com" && password === "adminCod3r123"){
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