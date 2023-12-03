import Router from "./router.js";
import { __dirname, generateToken } from "../utils.js";
import ProductManager from "../dao/dbManagers/products.manager.js";
import { productsModel } from "../dao/dbManagers/models/products.model.js";
import CartManager from "../dao/dbManagers/cart.manager.js";
import passport from "passport";
import { passportCall } from "../config/passport.config.js";



const productManager = new ProductManager()
const cartManager = new CartManager()


export default class ViewsRouter extends Router{
    init() {

        this.get('/login',["public"] , (req, res) => {
            res.render('login')
        });
        
        this.get('/register',["public"] , (req, res) => {
            res.render('register')
        });
        
        this.get('/', ["public"] , (req, res) => {
            return res.redirect('/login')
        });
        
        this.get('/logout',["public"] , (req, res) => {
            try {
                res.clearCookie('coderCookieToken');
                res.redirect("/login");
            } catch (error) {
                console.error('Error al realizar la operación de logout:', error);
                res.status(500).send({ status: 'error', message: error.message });
            }
        });

        //GITHUB
        
        this.get('/github', ["public"], passport.authenticate('github',{scope:['user:email']}), async(req, res) => {
            res.send({ status: 'success', message: 'usuario registrado'}) 
        })
         
        this.get('/github-callback',["public"],  passport.authenticate('github', {failureRedirect: '/login'}), async(req,res) => {
            const user = req.user
            const accessToken = generateToken(user)
            res.cookie("coderCookieToken", accessToken, {maxAge: 24*60*60*1000, httpOnly: true })
            res.redirect('/products')
        })
        
        //CHAT
        this.get("/chat", ["user"] , async (req, res)=>{
            try {
                res.render("chat")
            } catch (error) {
                console.error(error.message)
            }
        })

        //PRODUCTS

        this.get("/products", ["user"],  async (req, res)=>{
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

        this.get("/:cid", ["user"] , async (req, res)=>{
            try {
                const {cid} = req.params
                const cart = await cartManager.getCartProducts(cid)
                res.render("cart",{cart})
            } catch (error) {
                console.error(error.message)
            }
        })
    }
}






/* router.get("/realtimeproducts", (req, res)=>{
    res.render("realTimeProducts")
}) */
