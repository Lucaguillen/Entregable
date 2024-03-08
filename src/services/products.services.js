import { generateProducts } from "../utils.js"
import { ProductManager, usersManager } from "../dao/factory.js"
import ProductRepository from "../repositories/products.repositories.js"
import UserRepository from "../repositories/users.repositories.js"
const productManager = new ProductManager()
const productRepository = new ProductRepository(productManager)
const usermanager = new usersManager()
const userRepository = new UserRepository(usermanager)
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth:{
        user: "lucaguillen002@gmail.com",
        pass: "qhfqfceltfodqjiq"
    }
})

const getMockProducts = async ()=>{
    let products = []
    for (let i=0; i < 100; i++){
        products.push(generateProducts())
    }
    return products
}
const deleteProductService = async (id,ownerEmail)=>{
    const user = await userRepository.findByEmail(ownerEmail)
    if (user.role === "premium"){
        await transporter.sendMail({
            from: 'CODER',
            to: ownerEmail,
            subject: "Tu producto ha sido eliminado",
            html: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Producto Eliminado!</title>
                </head>
                <body>
                    <h1>¡Tu producto ha sido eliminado!</h1>
                    <p>Lamentablemente, se elimino tu producto.</p>
                    <p>Si crees que esto ha sido un error o deseas recuperar tu cuenta, por favor, contacta con nuestro equipo de soporte.</p>
                </body>
                </html>
            `
        });
    }
    const result = await productRepository.deleteProduct(id)
    return result
}

const getProductsService = async (id) =>{
    const result = await productRepository.getProducts(id)
    return result
}

const getProductsByIdService = async (id) =>{
    const result = await productRepository.getProductsById(id)
    return result
}

const updateProductService = async (productToUpdate,id) =>{
    const result = await productRepository.updateProduct(productToUpdate, id )
    return result
}
const addProductService = async (productCreated) =>{

    if (productCreated.status !== "false") {
        productCreated.status = true;
    }else{
        productCreated.status = false;
    }
    const result = await productRepository.addProduct(productCreated)
    return result
}

const getAllPaginateService = async  (limit, page, sort, query, queryvalue) => {
    
    const filter = {
        $or: [
            { category: { $regex: queryvalue || "", $options: "i" } },
            { stock: { $gte: Number(queryvalue) || 0 } } 
        ]
    };

    const options = {
        limit: Number(limit) || 10,
        page: Number(page) || 1,
    };

    if (sort === "1" || sort === "-1") {
        options.sort = { price: Number(sort) };
    }

    const products = await productRepository.productPaginate2(filter, options)
    return products
    
}




export{
    deleteProductService,
    getProductsService,
    getProductsByIdService,
    updateProductService,
    addProductService,
    getAllPaginateService,
    getMockProducts
}