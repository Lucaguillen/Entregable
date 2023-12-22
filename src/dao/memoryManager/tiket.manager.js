import { __dirname } from "../../utils.js";
import { TiketsModel } from "../dbManagers/models/tiket.model.js";

export default class TiketManager {
    constructor(path) {
        this.path = path;
    }
    create = async (newTiket) => {
        const tiket = await TiketsModel.create(newTiket)
        return tiket
    }  
    findById = async (id) => {
        const tiket = await TiketsModel.findOne({_id: id})
        return tiket
    }
} 