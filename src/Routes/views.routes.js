import Router from "./router.js";
import { __dirname} from "../utils.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enumns.js";
import {getcart, getproducts} from "../controllers/views.controller.js"

export default class ViewsRouter extends Router{
    constructor(){
        super()
    }
    init() {

        this.get('/login',[accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, async (req, res) => {
            res.render('login')
        });
        
        this.get('/register',[accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, async (req, res) => {
            res.render('register')
        });

        this.get("/products",[accessRolesEnum.USER,accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, getproducts)

        this.get("/chat", [accessRolesEnum.USER,accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, async (req, res)=>{
            return res.render("chat")
        })

        this.get("/cart", [accessRolesEnum.USER,accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, getcart)

        this.get('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, async (req, res) => {
            return res.redirect('/login')
        });
        
   
    }

}


