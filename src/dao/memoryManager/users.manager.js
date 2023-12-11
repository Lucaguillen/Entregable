import { __dirname } from "../../utils.js";
import usersModel from "../dbManagers/models/users.model.js";

export default class usersManager {
    constructor(path) {
        this.path = path;
    }
    create = async (newuser) => {
        const user = await usersModel.create(newuser)
        return user
    }  
    
    findByEmail = async (emailSend) =>{
        const user = await usersModel.findOne({email: emailSend}).populate({
            path: 'cart.id',
            model: 'carts'
        })
        .lean();
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


