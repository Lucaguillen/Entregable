import { __dirname } from "../../utils.js";
import { cartsModel } from "../dbManagers/models/carts.model.js";
import {usersModel} from "../dbManagers/models/users.model.js";

export default class usersManager {
    constructor(path) {
        this.path = path;
    }
    create = async (newuser) => {
        const user = await usersModel.create(newuser)
        return user
    }  
    
    deleteUsers = async (uid) => {
        const result = await usersModel.findByIdAndDelete({_id: uid})
        return result
    }

    setuploadedFiles = async (uid, file) =>{
        const result = await usersModel.updateOne(
            { _id: uid },
            { $push: { documents: file } }
        );
        const updatedUser = await usersModel.findOne({ _id: uid });
        return updatedUser;
    }

    allUsers = async () =>{
        const allUsers = await usersModel.find();
        return allUsers;
    }

    deleteManyUsers = async (userIds) =>{
        const result = await usersModel.deleteMany({ _id: { $in: userIds } });
        return result;
    }

    usersPaginate = async (page) =>{
        const result = await usersModel.paginate({},{limit: 4, page, lean: true})
        return result
    }
    

    setLastConnection = async (id, lastConnectionDate) =>{
        const result = await usersModel.updateOne(
            { _id: id },
            { $set: { last_connection: lastConnectionDate } }
        );
        const updatedUser = await usersModel.findOne({ _id: id });
        return updatedUser;
    }

    findByEmail = async (emailSend) =>{
        const user = await usersModel.findOne({email: emailSend}).populate({
            path: 'cart.id',
            model: 'carts'
        })
        .lean();
        return user
    }
    findByID = async (id) =>{
        const user = await usersModel.findOne({_id: id})
        return user
    }

    updateRol = async (id, rol) => {
        const result = await usersModel.updateOne(
            { _id: id },
            { $set: { role: rol } }
        );
        const updatedUser = await usersModel.findOne({ _id: id });
        return updatedUser;
    };

    updatePass = async (newPass, emailSend) => {
        const result = await usersModel.updateOne(
            { email: emailSend },
            { $set: { password: newPass } }
        );
        const updatedUser = await usersModel.findOne({ email: emailSend});
        return updatedUser;
    };
    
    

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


