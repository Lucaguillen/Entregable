import {createHash, generateToken, isValidPassword} from "../utils.js"
import { findByEmailService, registerService, nonSensitiveService } from "../services/user.services.js"
import CustomErrors from "../middlewares/errors/CustomErrors.js"
import { EErrors } from "../config/enumns.js"


//GITHUB
        
const github = async  (req, res)=>{
    res.send({ status: 'success', message: 'usuario registrado'}) 
}
 
const githubCallback = async (req,res)=>{
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

const current = async  (req, res) => {
    try {
        const {email} = req.user
        
        const user = await nonSensitiveService(email)
        return res.sendSuccess(user)
    } catch (error) {
        console.error('Error al realizar la operación de logout:', error);
        res.sendServerError(error.message)
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie('coderCookieToken');
        res.redirect("/login");
    } catch (error) {
        console.error('Error al realizar la operación de logout:', error);
        res.sendServerError(error.message)
    }
}

const login = async  (req,res)=>{
    try {
        const {email, password} = req.body
        const user = await findByEmailService(email)
        if (!user || !isValidPassword(password, user.password) ) {
            req.logger.error("usuario no encontrado o contraseña incorrecta")
            throw CustomErrors.createError({
                name: "Error de Credenciales",
                cause: "usuario no encontrado o contraseña incorrecta",
                message: "Error al intentar iniciar sesion",
                code: EErrors.CREDENTIALS_ERROR
            })
            
        }
        delete user.password
        const accessToken = generateToken(user)
        res.cookie("coderCookieToken", accessToken, {maxAge: 24*60*60*1000, httpOnly: true }).send({ status: "success", message: "login success"})

    } catch (error) { 
        res.sendClientError(error.message)
    }
}
const register  = async  (req,res)=>{
    try {
        const user = req.body
        const {email, password} = req.body
        const userExist = await findByEmailService(email)
        if(userExist) {
            req.logger.error("Ya existe un usuario registrado con este correo electronico")
            throw CustomErrors.createError({
                name: "Usuario existente",
                cause: "Se intento registrar un usuario ya existente",
                message: "Ya existe un usuario registrado con este correo electronico",
                code: EErrors.CONFLICT_ERROR
            })
            
        }

        //
        await registerService(user, email, password)
        
        res.status(201).send({status: 'success', message: 'Usuario Registrado'}) 
    } catch (error) {
        res.sendClientError(error.message)
    }
}

export {
    github,
    githubCallback,
    current,
    logout,
    login,
    register
}