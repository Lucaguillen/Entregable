import { Router } from "express";
import { __dirname, authotization } from "../utils.js";
import ProductManager from "../dao/dbManagers/products.manager.js";
import { productsModel } from "../dao/dbManagers/models/products.model.js";
import CartManager from "../dao/dbManagers/cart.manager.js";
import passport from "passport";
import { passportCall } from "../config/passport.config.js";

const router = Router()

const productManager = new ProductManager()
const cartManager = new CartManager()



router.get('/login', (req, res) => {
    res.render('login')
});

router.get('/register', (req, res) => {
    res.render('register')
});

router.get('/', (req, res) => {
    return res.redirect('/login')
});


//CHAT
router.get("/chat", async (req, res)=>{
    try {
        res.render("chat")
    } catch (error) {
        console.error(error.message)
    }
})

//PRODUCTOS

router.get("/products", passportCall("jwt"),authotization("user"),  async (req, res)=>{
    try {
        const {page = 1} = req.query
        const {docs, hasPrevPage, hasNextPage, nextPage, prevPage} = await productsModel
        .paginate({},{limit: 4, page, lean: true})
        res.render("home",{
            products: docs,hasPrevPage,hasNextPage,nextPage,prevPage,
            user: req.user
            
        })
    } catch (error) {
        console.error(error.message)
    }
})
// CART

router.get("/:cid", async (req, res)=>{
    try {
        const {cid} = req.params
        const cart = await cartManager.getCartProducts(cid)
        res.render("cart",{cart})
    } catch (error) {
        console.error(error.message)
    }
})



/* router.get("/realtimeproducts", (req, res)=>{
    res.render("realTimeProducts")
}) */

export default router