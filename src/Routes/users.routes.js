import Router from "./router.js"
import { accessRolesEnum, passportStrategiesEnum } from "../config/enumns.js";
import { github, githubCallback, current, logout, login, register } from "../controllers/users.controller.js"


export default class UsersRouter extends Router{
    constructor(){
        super()
    }
    init() {

        this.get("/current", [accessRolesEnum.USER], passportStrategiesEnum.JWT ,current)


        this.post("/login", [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING ,login)
        this.post('/register',[accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, register)
        this.get('/logout',[accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, logout)
        this.get('/github',[accessRolesEnum.PUBLIC], passportStrategiesEnum.GITHUB, github)
        this.get('/github-callback',[accessRolesEnum.PUBLIC],passportStrategiesEnum.GITHUB, githubCallback)

    }

}




