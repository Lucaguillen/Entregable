import { Router } from "express";
import __dirname from "../utils.js";
import fs from "fs";
import CartManager from "../managers/cart.Manager.js";

const cartManager = new CartManager(`${__dirname}/managers/files/Carritos.json`);

const router = Router()

router.post("/", async (req,res)=>{
    try {
        const result = await cartManager.createCart()
        if (result.status === "success"){
            res.send(result)
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
    }
})

router.get("/:cid", async (req, res)=>{
    const cid = Number(req.params.cid);
    try {
        const carts =  await cartManager.getCartProducts(cid);
        if(carts.status === "error"){
            return res.status(404).send(carts);
        }else if(carts.status === "success"){
            return res.send(carts.products)
        }

    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
    } 
})

router.post("/:cid/product/:pid", async (req, res)=>{
    const cid = Number(req.params.cid);
    const pid = Number(req.params.pid);
    try {
        const carts = await cartManager.addProductCart(cid,pid)
        if(carts.status === "error"){
            res.status(404).send(carts)
        }else {
            res.send(carts)
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
    } 
})
export default router;