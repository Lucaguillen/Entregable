import Router from "./router.js"
import passport from 'passport';
import {generateToken, isValidPassword} from "../utils.js"
import usersModel from '../dao/dbManagers/models/users.model.js';





//JWT
export default class SessionsRouter extends Router{
    init() {
        //global
        this.get("*", (req, res) =>{
            res.status(404).send("ruta inexistente ")
        })
        
        
        

        this.post("/login", ["public"] , async (req,res)=>{
            try {
        
                const {email, password} = req.body
                const user = await usersModel.findOne({email: email})
                if (!user || !isValidPassword(password, user.password) ) {
                    return res.sendClientError("usuario no encontrado o contraseña incorrecta")
                }
                delete user.password
                const accessToken = generateToken(user)
                res.cookie("coderCookieToken", accessToken, {maxAge: 24*60*60*1000, httpOnly: true }).send({ status: "success", message: "login success"})
        
            } catch (error) { 
                res.sendClientError(error.message)
            }
        })
        //LocalStrategy

        this.post('/register',["public"], passport.authenticate('register',{failureRedirect: 'failRegister'}), async (req, res) => {
            res.status(201).send({status: 'success', message: 'Usuario Registrado'})
        });

        this.get('/failRegister',["public"], async (req, res) =>{
            res.status(500).send({status: 'error', message: 'falla en el registro'})
        })

        

    }
}


/* router.get('/failLogin', async (req, res) =>{
    res.status(500).send({status: 'error', message: 'falla en el Inicio de sesion'})
}) */




