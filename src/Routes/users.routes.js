import Router from "./router.js"
import { accessRolesEnum, passportStrategiesEnum } from "../config/enumns.js";
import {current, logout, login, register,updateRol, recoverPass,changePass, uploadedFiles, allUsers,cleanUsers, deleteUser} from "../controllers/users.controller.js"


export default class UsersRouter extends Router{
    constructor(){
        super()
    }
    init() {

        this.get("/current", [accessRolesEnum.USER,accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT ,current)
        this.get("/", [accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT ,allUsers)
        this.delete("/", [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT ,cleanUsers)
        this.delete("/:uid", [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT ,deleteUser)


        this.post("/:uid/documents", [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, true, uploadedFiles)
        this.put("/premium/:uid",[accessRolesEnum.USER,accessRolesEnum.ADMIN,accessRolesEnum.PREMIUM],passportStrategiesEnum.JWT, updateRol)

        this.post("/login", [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, false ,login)
        this.post('/register',[accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, false, register)
        this.get('/logout',[accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, logout)
        this.post("/recoverPass",[accessRolesEnum.PUBLIC],passportStrategiesEnum.NOTHING, false, recoverPass)
        this.put("/changePass",[accessRolesEnum.PUBLIC],passportStrategiesEnum.NOTHING, changePass)

    }

}




