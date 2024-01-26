import Router from "./router.js"
import { accessRolesEnum, passportStrategiesEnum } from "../config/enumns.js";
import {/*  github, githubCallback, */ current, logout, login, register,updateRol, recoverPass,changePass  } from "../controllers/users.controller.js"


export default class UsersRouter extends Router{
    constructor(){
        super()
    }
    init() {

        this.get("/current", [accessRolesEnum.USER,accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT ,current)


        this.post("/login", [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING ,login)
        this.post('/register',[accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, register)
        this.get('/logout',[accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, logout)
        this.put("/premium/:uid",[accessRolesEnum.USER,accessRolesEnum.ADMIN,accessRolesEnum.PREMIUM],passportStrategiesEnum.JWT, updateRol)
        this.post("/recoverPass",[accessRolesEnum.PUBLIC],passportStrategiesEnum.NOTHING, recoverPass)
        this.put("/changePass",[accessRolesEnum.PUBLIC],passportStrategiesEnum.NOTHING, changePass)

        /* this.get('/github',[accessRolesEnum.PUBLIC], passportStrategiesEnum.GITHUB, github) */
        /* this.get('/github-callback',[accessRolesEnum.PUBLIC],passportStrategiesEnum.GITHUB, githubCallback) */

    }

}




