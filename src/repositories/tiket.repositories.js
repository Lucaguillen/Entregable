

export default class TiketRepository {
    constructor (TiketDao){
        this.TiketDao = TiketDao
    }

    create = async (newTiket) => {
        const tiket = await this.TiketDao.create(newTiket)
        return tiket
    }  
    findById = async (id) => {
        const tiket = await this.TiketDao.findTiketById(id)
        return tiket
    }
    findByEmail = async (email) => {
        const tiket = await this.TiketDao.findTiketByEmail(email)
        return tiket
    }
   
}