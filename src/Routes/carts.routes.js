import Router from "./router.js"
import { __dirname } from "../utils.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enumns.js";
import { createOne, cartbyid, addProdToCart, removeQuantiyToProduct, deleteProdToCart, emptyCart } from "../controllers/cart.controller.js";

export default class CartRouter extends Router {
    constructor(){
        super()
    }
    init(){
        this.post("/", [accessRolesEnum.USER], passportStrategiesEnum.JWT, createOne)//
        this.get("/:cid",[accessRolesEnum.USER], passportStrategiesEnum.JWT, cartbyid)//
        this.post("/product/:pid", [accessRolesEnum.USER], passportStrategiesEnum.JWT, addProdToCart)//
        this.post("/removeQuantity/:pid", [accessRolesEnum.USER], passportStrategiesEnum.JWT, removeQuantiyToProduct)//
        this.delete("/remove/:pid",[accessRolesEnum.USER], passportStrategiesEnum.JWT, deleteProdToCart)//
        this.delete("/empty/:cid",[accessRolesEnum.USER], passportStrategiesEnum.JWT, emptyCart)//

    }  
}






