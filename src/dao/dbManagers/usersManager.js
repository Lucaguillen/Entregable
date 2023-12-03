import { __dirname } from "../../utils.js";
import usersModel from "./models/users.model.js";

export default class usersManager {
    constructor(path) {
        this.path = path;
    }
    create = async (newuser) => {
        const user = await usersModel.create(newuser)
        return user
    }  
    
    findByEmail = async (emailSend) =>{
        const user = await usersModel.findOne({email: emailSend})
        return user
    }
} 


