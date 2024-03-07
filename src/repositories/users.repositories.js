import UsersDTO from "../DTOs/users.dto.js";
import UsersMainDataDTO from "../DTOs/usersMainData.dto.js";
import RecoverDTO from "../DTOs/recover.dto.js";

export default class UserRepository {
    constructor (UsersDao){
        this.UsersDao = UsersDao
    }

    uploadedFiles = async (uid, file)=>{
        const result = await this.UsersDao.setuploadedFiles(uid, file)
        return result
    }

    deleteUsers = async (uid)=>{
        const result = await this.UsersDao.deleteUsers(uid)
        return result
    }

    usersPaginate = async (page) =>{
        const result = await this.UsersDao.usersPaginate(page)
        return result
    }

    lastconnection = async (id,lastConnectionDate)=>{
        const last = await this.UsersDao.setLastConnection(id, lastConnectionDate)
        return last
    }

    allUsersMainDto = async () =>{
        const user = await this.UsersDao.allUsers()
        const recoverDTO = new UsersMainDataDTO(user)
        return recoverDTO
    }
    allUsers = async () =>{
        const user = await this.UsersDao.allUsers()
        return user
    }

    deleteInactives = async (userIds) =>{
        const result = await this.UsersDao.deleteManyUsers(userIds)
        return result
    }
    recoverPassInfo = async (email) =>{
        const user = await this.UsersDao.findByEmail(email)
        const recoverDTO = new RecoverDTO(user)
        return recoverDTO
    }

    updatePass = async (newPass, emailSend) =>{
        const user = await this.UsersDao.updatePass(newPass, emailSend)
        return user
    }
    
    create = async (newuser) => {
        const user = await this.UsersDao.create(newuser)
        return user
    }  
    
    findByEmail = async (emailSend) =>{
        const user = await this.UsersDao.findByEmail(emailSend)
        return user
    }

    findByID = async (id) =>{
        const user = await this.UsersDao.findByID(id)
        return user
    }

    updateRol = async (id, rol) =>{
        const user = await this.UsersDao.updateRol(id, rol)
        return user
    }

    nonSensitiveUserInfo = async (email) =>{
        const user = await this.UsersDao.findByEmail(email)
        const userDTO = new UsersDTO(user)
        return userDTO
    }

    setCartToUser = async (cid,uid) =>{
        const user = await this.UsersDao.setCartToUser(cid,uid)
        return user
    }
}


