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
    setCartToUser = async (cid,uid) =>{
        try {
            const user = await usersModel.findOneAndUpdate(
                {_id: uid},
                {$push: {"cart.id": cid}},
                {new: true}
            )
        } catch (error) {
            console.error(error.message)
        }


    }
} 


