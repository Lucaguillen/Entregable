import Router from "./router.js"
import { __dirname } from "../utils.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enumns.js";
import { createOne, cartbyid, addProdToCart, removeQuantiyToProduct, deleteProdToCart, emptyCart, purchase } from "../controllers/cart.controller.js";

export default class CartRouter extends Router {
    constructor(){
        super()
    }
    init(){
        this.post("/", [accessRolesEnum.USER, accessRolesEnum.ADMIN,accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT, false, createOne)//
        this.get("/:cid",[accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, cartbyid)//
        this.post("/product/:pid", [accessRolesEnum.USER, accessRolesEnum.ADMIN,accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT, false, addProdToCart)//
        this.post("/removeQuantity/:pid", [accessRolesEnum.USER, accessRolesEnum.ADMIN,accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT, false, removeQuantiyToProduct)//
        this.delete("/remove/:pid",[accessRolesEnum.USER, accessRolesEnum.ADMIN,accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT, deleteProdToCart)//
        this.delete("/empty/:cid",[accessRolesEnum.USER, accessRolesEnum.ADMIN,accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT, emptyCart)//
        this.put("/:cid",[accessRolesEnum.USER, accessRolesEnum.ADMIN,accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT, )//
        this.post("/:cid/purchase", [accessRolesEnum.USER, accessRolesEnum.ADMIN,accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT, false, purchase)//



    }  
}






