import { Router } from "express";
import __dirname from "../utils.js";
import fs from "fs";
import CartManager from "../managers/cart.Manager.js";

const cartManager = new CartManager(`${__dirname}/managers/files/Carritos.json`);

const router = Router()

router.post("/", async (req,res)=>{
    const carts =  await cartManager.getCarts();
    const cart = {
        products: []
    };
    if(carts.length === 0){
        cart.id = 1;
    }else{
        cart.id = carts[carts.length -1].id + 1;
    }
    carts.push(cart)
    await fs.promises.writeFile(`${__dirname}/managers/files/Carritos.json`, JSON.stringify(carts, null, '\t'));
    res.send({status: "success", message: "carrito createado"})
})

router.get("/:cid", async (req, res)=>{
    const carts =  await cartManager.getCarts();
    const cid = Number(req.params.cid);
    const cindex = carts.findIndex(c=> c.id === cid)
    if(cindex === -1) return  res.status(404).send({status: "error", message: "no se encontro el carrito"})
    res.send(carts[cindex].products);
})

router.post("/:cid/product/:pid", async (req, res)=>{
    const cid = Number(req.params.cid);
    const pid = Number(req.params.pid);
    const carts =  await cartManager.getCarts();
    const cindex = carts.findIndex(c=> c.id === cid)
    const pindex = carts[cindex].products.findIndex(p=> p.id === pid)
    
    const product = {
        id: pid,
        quantity: 1
    }
    
    if(cindex === -1) return  res.status(404).send({status: "error", message: "no se encontro el carrito"})
    if(!carts[cindex].products.some(p => p.id === pid)){
        carts[cindex].products.push(product)
        await fs.promises.writeFile(`${__dirname}/managers/files/Carritos.json`, JSON.stringify(carts, null, '\t'));
        res.send({status: "success", message: "nuevo producto agregado al carrito"})
    }else{
        carts[cindex].products[pindex].quantity++
        res.send({status: "success", message: "cantidad de producto actualizada"})
        await fs.promises.writeFile(`${__dirname}/managers/files/Carritos.json`, JSON.stringify(carts, null, '\t'));

    }
    

})
export default router;
