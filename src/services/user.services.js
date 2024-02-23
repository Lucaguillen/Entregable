import {createHash, isValidPassword,generatePassToken} from "../utils.js"
import { usersManager, CartManager} from "../dao/factory.js"
const cartManager = new CartManager()
const usermanager = new usersManager()
import config from "../../config.js";
import UserRepository from "../repositories/users.repositories.js";
import CartRepository from "../repositories/carts.repositories.js";
import nodemailer from "nodemailer"
const userRepository = new UserRepository(usermanager)
const cartRepository = new CartRepository(cartManager)


const uploadedFilesService = async (uid) =>{

}

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth:{
        user: "lucaguillen002@gmail.com",
        pass: "qhfqfceltfodqjiq"
    }
})
const setNewPassService = async (newPass, emailSend) =>{
    let passwordHashed = createHash(newPass)
    const result = await userRepository.updatePass(passwordHashed, emailSend)
    return result
}

const LastConnectionService = async (id) => {
    let lastConnectionDate = new Date();
    await userRepository.lastconnection(id,lastConnectionDate)
    
}
const recoverPassService = async (user) => {

    const accessToken = generatePassToken(user)
    
    
    await transporter.sendMail({
        from:'CODER',
        to: user.email,
        subject: "Recupera tu contraseña",
        html: 
        `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Restablecer Contraseña</title>
            </head>
            <body>
                <h1>Para establecer tu nueva contraseña, accede al siguiente enlace:</h1>
                <p><a href="http://localhost:8080/passreset/${accessToken}" style="text-decoration: none; color: #007BFF;">Haz click aquí</a></p>
                <p>Si el enlace anterior no funciona, puedes copiar y pegar el siguiente en tu navegador:</p>
                <p>http://localhost:8080/passreset/${accessToken}</p>
            </body>
            </html>
        `

    })
}
const recoverPassInfoService = async (email) =>{
    const user = await userRepository.recoverPassInfo(email)
    return user
}
const updateRolService = async (id) =>{
    const user = await userRepository.findByID(id)
    user.role = (user.role === "premium") ? "user" : (user.role === "user") ? "premium" : user.role;
    
    const userRolUpdated = await userRepository.updateRol(id, user.role)
    return userRolUpdated
}

const findByEmailService = async  (email) => {
    const user = await userRepository.findByEmail(email)
    return user
}

const findByIDService = async  (id) => {
    const user = await userRepository.findByID(id)
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
    }else{
        user.role = "user"
    }
    
    const result = await userRepository.create(user)

    const newCart = {
        productsCart: [],
        userId: result._id
    };
    
    const createCart = await cartRepository.createCart(newCart)
    const setCart = await userRepository.setCartToUser(createCart, result._id)
}
export{
    findByEmailService,
    registerService,
    nonSensitiveService,
    updateRolService,
    findByIDService,
    recoverPassService,
    recoverPassInfoService,
    setNewPassService,
    LastConnectionService,
    uploadedFilesService
}