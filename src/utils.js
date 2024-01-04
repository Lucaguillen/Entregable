import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { fakerES as faker } from "@faker-js/faker"

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

const generateProducts = ()=>{
    return{
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.number.int(),
        price: faker.commerce.price({ min: 50, max: 2000 }),
        stock: faker.number.int({ min: 0, max: 100 }),
        category: faker.commerce.productMaterial(),
        thumbnails: [],
        status: faker.datatype.boolean(),
        pid: faker.database.mongodbObjectId()
    }
}

export {
    __dirname,
    createHash,
    isValidPassword,
    generateToken,
    PRIVATE_KEY,
    authotization,
    generateProducts
}