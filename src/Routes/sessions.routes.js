import { Router } from 'express';
import passport from 'passport';
import {generateToken, isValidPassword} from "../utils.js"
import usersModel from '../dao/dbManagers/models/users.model.js';


const router = Router();

router.get("*", (req, res) =>{
    res.status(404).send("ruta inexistente ")
})
router.put()

//GITHUB

router.get('/github', passport.authenticate('github',{scope:['user:email']}), async(req, res) => {
   res.send({ status: 'success', message: 'usuario registrado'}) 
})

router.get('/github-callback', passport.authenticate('github', {failureRedirect: '/login'}), async(req,res) => {
    const user = req.user
    const accessToken = generateToken(user)
    res.cookie("coderCookieToken", accessToken, {maxAge: 24*60*60*1000, httpOnly: true })
    res.redirect('/products')
})


//JWT

router.post('/login', async (req, res) => {
    
    try {
        
        const {email, password} = req.body
        const user = await usersModel.findOne({email: email})
        if (!user || !isValidPassword(password, user.password) ) {
            return res.status(401).send({status: "error", message: "usuario no encontrado o contraseña incorrecta"})
        }
        delete user.password
        const accessToken = generateToken(user)
        res.cookie("coderCookieToken", accessToken, {maxAge: 24*60*60*1000, httpOnly: true }).send({ status: "success", message: "login success"})

    } catch (error) { 
        res.status(500).send({status: "error", message: error.message})
    }
      
});

/* router.get('/failLogin', async (req, res) =>{
    res.status(500).send({status: 'error', message: 'falla en el Inicio de sesion'})
}) */


//LocalStrategy

router.post('/register', passport.authenticate('register',{failureRedirect: 'failRegister'}), async (req, res) => {
    res.status(201).send({status: 'success', message: 'Usuario Registrado'})
});

router.get('/failRegister', async (req, res) =>{
    res.status(500).send({status: 'error', message: 'falla en el registro'})
})

router.get('/logout', (req, res) => {
    try {
        res.clearCookie('coderCookieToken');
        res.redirect("/login");
    } catch (error) {
        console.error('Error al realizar la operación de logout:', error);
        res.status(500).send({ status: 'error', message: error.message });
    }
});

export default router;