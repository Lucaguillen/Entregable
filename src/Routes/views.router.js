import { Router } from "express";
import __dirname from "../utils.js";
import fs from "fs";
import ProductManager from "../managers/products.manager.js";

const productManager = new ProductManager(`${__dirname}/managers/files/Productos.json`);
const products = await productManager.getProducts();

const router = Router()

router.get("/", (req, res)=>{
    res.render("home",{products: products,})
})

router.get("/realtimeproducts", (req, res)=>{
    res.render("realTimeProducts")
})

export default router