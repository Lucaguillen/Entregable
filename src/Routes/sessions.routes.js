import Router from "./router.js"
import {createHash, generateToken, isValidPassword} from "../utils.js"
import usersManager from "../dao/dbManagers/usersManager.js";
import CartManager from "../dao/dbManagers/cart.manager.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enumns.js";


export default class SessionsRouter extends Router{
    constructor(){
        super()
        this.usermanager = new usersManager()
        this.cartManager = new CartManager()
    }
    init() {

        this.post("/login", [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING ,this.login)
        this.post('/register',[accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, this.register)
        this.get('/logout',[accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, this.logout)
        this.get('/github',[accessRolesEnum.PUBLIC], passportStrategiesEnum.GITHUB,this.github)
        this.get('/github-callback',[accessRolesEnum.PUBLIC],passportStrategiesEnum.GITHUB,this.githubCallback)

    }

    //GITHUB
        
    async github (req, res){
        res.send({ status: 'success', message: 'usuario registrado'}) 
    }
     
    async githubCallback (req,res){
        try {
            const user = req.user
            const accessToken = generateToken(user)
            res.cookie("coderCookieToken", accessToken, {maxAge: 24*60*60*1000, httpOnly: true })
            res.redirect('/products')
        } catch (error) {
            console.error("falla en el inicio se session con GIT-HUB")
            res.redirect("/login")
        }
    }

    async logout (req, res) {
        try {
            res.clearCookie('coderCookieToken');
            res.redirect("/login");
        } catch (error) {
            console.error('Error al realizar la operación de logout:', error);
            res.sendServerError(error.message)
        }
    }

    async login (req,res){
        try {
    
            const {email, password} = req.body
            const user = await this.usermanager.findByEmail(email)
            if (!user || !isValidPassword(password, user.password) ) {
                return res.sendClientError("usuario no encontrado o contraseña incorrecta")
            }
            delete user.password
            const accessToken = generateToken(user)
            res.cookie("coderCookieToken", accessToken, {maxAge: 24*60*60*1000, httpOnly: true }).send({ status: "success", message: "login success"})
    
        } catch (error) { 
            res.sendClientError(error.message)
        }
    }

    async register (req,res){
        try {
            const user = req.body
            const {email, password} = req.body
            const userExist = await this.usermanager.findByEmail(email)
            if(userExist) {
                return res.status(409).json({ error: 'El usuario ya existe.' });
            }

            let passwordHashed = createHash(password)
            user.password = passwordHashed
            
            if(email === "adminCoder@coder.com" && password === "adminCod3r123"){
                user.role = "admin"
            }
            
            const result = await this.usermanager.create(user);

            const newCart = {productsCart: []};
            const createCart = await this.cartManager.createCart(newCart, result.email)
            

            res.status(201).send({status: 'success', message: 'Usuario Registrado'}) 
        } catch (error) {
            res.sendClientError(error.message)
        }
    }
}




