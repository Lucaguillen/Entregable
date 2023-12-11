import Router from "./router.js"
import { __dirname } from "../utils.js";

import { accessRolesEnum, passportStrategiesEnum } from "../config/enumns.js";
import {getAll, getByID, createProduct, updateProduct, deleteProduct} from "../controllers/products.controller.js"

export default class ProductsRouter extends Router{
    constructor(){
        super()
    }

    init(){

        this.get("/", [accessRolesEnum.PUBLIC], passportStrategiesEnum.JWT, getAll)
        this.get("/:id", [accessRolesEnum.PUBLIC], passportStrategiesEnum.JWT, getByID)
        this.post("/", [accessRolesEnum.PUBLIC], passportStrategiesEnum.JWT, createProduct)
        this.put("/:id", [accessRolesEnum.PUBLIC], passportStrategiesEnum.JWT, updateProduct)
        this.delete("/:id", [accessRolesEnum.PUBLIC], passportStrategiesEnum.JWT, deleteProduct)
    }

}







