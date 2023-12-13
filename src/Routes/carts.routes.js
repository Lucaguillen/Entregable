import Router from "./router.js"
import { __dirname } from "../utils.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enumns.js";
import { createOne, cartbyid, addProdToCart, removeQuantiyToProduct, deleteProdToCart, emptyCart } from "../controllers/cart.controller.js";

export default class CartRouter extends Router {
    constructor(){
        super()
    }
    init(){
        this.post("/", [accessRolesEnum.USER,accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, createOne)//
        this.get("/:cid",[accessRolesEnum.USER,accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, cartbyid)//
        this.post("/product/:pid", [accessRolesEnum.USER,accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, addProdToCart)//
        this.post("/removeQuantity/:pid", [accessRolesEnum.USER,accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, removeQuantiyToProduct)//
        this.delete("/remove/:pid",[accessRolesEnum.USER,accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, deleteProdToCart)//
        this.delete("/empty/:cid",[accessRolesEnum.USER,accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, emptyCart)//

    }  
}






