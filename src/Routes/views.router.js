import Router from "./router.js";
import { __dirname} from "../utils.js";
import { productsModel } from "../dao/dbManagers/models/products.model.js";
import CartManager from "../dao/dbManagers/cart.manager.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enumns.js";


export default class ViewsRouter extends Router{
    constructor(){
        super()
        this.cartManager = new CartManager()
    }
    init() {

        this.get('/login',[accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, async (req, res) => {
            res.render('login')
        });
        
        this.get('/register',[accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, async (req, res) => {
            res.render('register')
        });

        this.get("/products",[accessRolesEnum.USER], passportStrategiesEnum.JWT, this.getproducts)

        this.get("/chat", [accessRolesEnum.USER] , passportStrategiesEnum.JWT, async (req, res)=>{
            return res.render("chat")
        })

        this.get("/cart", [accessRolesEnum.USER] , passportStrategiesEnum.JWT, this.getcart)

        this.get('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, async (req, res) => {
            return res.redirect('/login')
        });
        
   
    }

    async getcart (req, res){
        try {
            const cid = req.user.cart.id
            const cart = await this.cartManager.getCartProducts(cid)
            res.render("cart",{
                cart,
                user:req.user
            })
        } catch (error) {
            console.error(error.message)
        }
    }

    async getproducts (req, res){
        try {
            const cid = req.user.cart.id
            const {page = 1} = req.query
            const {docs, hasPrevPage, hasNextPage, nextPage, prevPage} = await productsModel
            .paginate({},{limit: 4, page, lean: true})
            res.render("home",{
                user: req.user,
                products: docs,hasPrevPage,hasNextPage,nextPage,prevPage,cid
                
                
            })
        } catch (error) {
            console.error(error.message)
        }
    }
}


