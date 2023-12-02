import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (plainPassword, hashedPassword) => bcrypt.compareSync(plainPassword, hashedPassword);

//JWT

const PRIVATE_KEY = "coder55575"

const generateToken = (user) =>{
    const token = jwt.sign({user}, PRIVATE_KEY, {expiresIn: "24h"});
    return token
}

const authotization = (role) =>{
    return async (req, res, next) =>{
        if(req.user.role !== role) return res.status(403).send({status: "error", message: "Sin permisos"})
        next()
    }
}

export {
    __dirname,
    createHash,
    isValidPassword,
    generateToken,
    PRIVATE_KEY,
    authotization
}