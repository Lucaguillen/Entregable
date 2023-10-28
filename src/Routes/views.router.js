import { Router } from "express";
import __dirname from "../utils.js";
import ProductManager from "../dao/dbManagers/products.manager.js";


const router = Router()

const productManager = new ProductManager()

//CHAT
router.get("/chat", async (req, res)=>{
    try {
        res.render("chat")
    } catch (error) {
        console.error(error.message)
    }
})

//PRODUCTOS

router.get("/", async (req, res)=>{
    try {
        const products = await productManager.getProducts()
        res.render("home", {products})
    } catch (error) {
        console.error(error.message)
    }
})



router.get("/realtimeproducts", (req, res)=>{
    res.render("realTimeProducts")
})

export default router