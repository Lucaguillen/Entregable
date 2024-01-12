import { newTiketService } from "../services/tiket.services"

const createTiket = async  (req, res)=>{
    try {
        const result = await newTiketService()
        return result
    } catch (error) {
        req.logger.fatal(error.message)
        res.sendClientError(error.message)
    }
}

const getTiket = async  (req, res)=>{
    try {
        
    } catch (error) {
        req.logger.fatal(error.message)
        res.sendClientError(error.message)
    }
}

const addToTiket = async  (req, res)=>{
    try {
        
    } catch (error) {
        req.logger.fatal(error.message)
        res.sendClientError(error.message)
    }
}

export{
    createTiket,
    getTiket,
    addToTiket
}