import UsersDTO from "../DTOs/users.dto.js";

export default class UserRepository {
    constructor (UsersDao){
        this.UsersDao = UsersDao
    }

    create = async (newuser) => {
        const user = await this.UsersDao.create(newuser)
        return user
    }  
    
    findByEmail = async (emailSend) =>{
        const user = await this.UsersDao.findByEmail(emailSend)
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


