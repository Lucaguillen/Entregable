import { getCartproduct, getAllproducts, getAllUsers } from "../services/views.services.js"
import { findByEmailService } from "../services/tiket.services.js"
import jwt, { decode } from "jsonwebtoken"
import { PRIVATE_KEY } from "../utils.js"


const tiket = async (req, res)=>{
    const {email} = req.params
    const purchaseTiket = await findByEmailService(email)
    const userTiket = purchaseTiket.toObject();
    try {
        res.render('tiket',{userTiket: userTiket})
    } catch (error) {
        req.logger.fatal(error.message)
        res.sendClientError(error.message)
    }
}

const passReset = async (req, res) =>{
    const token = req.params.jwt
    try {
        jwt.verify(token, PRIVATE_KEY, (error, decode) => {
            if (error) return res.render('recoverPass');
            res.render('resetPass', {email:decode.user.email})
        })  
    } catch (error) {
        req.logger.fatal(error.message)
        res.sendClientError(error.message)
    }
}

const loggers = async (req, res) => {
    try {
        req.logger.fatal('prueba fatal');
        req.logger.error('prueba error');
        req.logger.warning('prueba warning');
        req.logger.info('prueba info');
        req.logger.http('prueba http');
        req.logger.debug('prueba debug');
    
        res.send({ result: 'hola' });
    } catch (error) {
        req.logger.fatal(error.message)
        res.sendClientError(error.message)
    }
}

const getcart = async  (req, res)=>{
    try {
        const cid = req.user.cart.id
        const cart = await getCartproduct(cid)
        res.render("cart",{
            cart,
            user:req.user
        })
    } catch (error) {
        req.logger.fatal(error.message)
        res.sendClientError(error.message)
    }
}

const getproducts = async  (req, res)=>{
    try {
        const cid = req.user.cart.id
        const {page = 1} = req.query
        const {docs, hasPrevPage, hasNextPage, nextPage, prevPage} = await getAllproducts(page)
        res.render("home",{
            user: req.user,
            products: docs,hasPrevPage,hasNextPage,nextPage,prevPage,cid
            
            
        })
    } catch (error) {
        req.logger.fatal(error.message)
        res.sendClientError(error.message)
    }
}

const getUsers = async  (req, res)=>{
    try {
        const {page = 1} = req.query
        const {docs, hasPrevPage, hasNextPage, nextPage, prevPage} = await getAllUsers(page)
        res.render("admin",{
            user: req.user,
            allUsers: docs,hasPrevPage,hasNextPage,nextPage,prevPage
 
        })
    } catch (error) {
        req.logger.fatal(error.message)
        res.sendClientError(error.message)
    }
}


export{
    getcart,
    getproducts,
    loggers,
    passReset,
    getUsers,
    tiket
}