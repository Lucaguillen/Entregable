import { newTiketService } from "../services/tiket.services"

const createTiket = async  (req, res)=>{
    try {
        const result = await newTiketService()
        return result
    } catch (error) {
        console.error(error.message)
    }
}

const getTiket = async  (req, res)=>{
    try {
        
    } catch (error) {
        console.error(error.message)
    }
}

const addToTiket = async  (req, res)=>{
    try {
        
    } catch (error) {
        console.error(error.message)
    }
}

export{
    createTiket,
    getTiket,
    addToTiket
}