import { Router } from "express";
import { __dirname } from "../utils.js";
import ProductManager from "../dao/dbManagers/products.manager.js";
import { productsModel } from "../dao/dbManagers/models/products.model.js";
import CartManager from "../dao/dbManagers/cart.manager.js";

const router = Router()

const productManager = new ProductManager()
const cartManager = new CartManager()


// SESSION

const publico = (req, res, next) => {
    if(req.session?.user) return res.redirect('/');
    next();
}

const privado = (req, res, next) => {
    if(!req.session?.user) return res.redirect('/login');
    next();
}

router.get('/login', publico, (req, res) => {
    res.render('login')
});

router.get('/register', publico, (req, res) => {
    res.render('register')
});

router.get('/', privado, (req, res) => {
    return res.redirect('/products')
});


//CHAT
router.get("/chat", privado, async (req, res)=>{
    try {
        res.render("chat")
    } catch (error) {
        console.error(error.message)
    }
})

//PRODUCTOS

router.get("/products", privado, async (req, res)=>{
    try {
        const {page = 1} = req.query
        const {docs, hasPrevPage, hasNextPage, nextPage, prevPage} = await productsModel
        .paginate({},{limit: 4, page, lean: true})
        res.render("home",{
            products: docs,hasPrevPage,hasNextPage,nextPage,prevPage,
            user: req.session.user
        })
    } catch (error) {
        console.error(error.message)
    }
})
// CART

router.get("/:cid", privado, async (req, res)=>{
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