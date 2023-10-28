import { Router } from "express";
import __dirname from "../utils.js";
import CartManager from "../dao/dbManagers/cart.manager.js";


const cartManager = new CartManager();

const router = Router()

router.post("/", async (req,res)=>{
    try {
        const carts = await cartManager.getCarts()
        const newCart = {
            products: []
        };
        if(carts.length === 0){
            newCart.id = 1;
        }else{
            newCart.id = carts[carts.length -1].id + 1;
        }
        const addCart = await cartManager.createCart(newCart)
        res.send({status: "success", message: "Nuevo carrito creado"})
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
    }
})

router.get("/:cid", async (req, res)=>{
    const cid = Number(req.params.cid);
    try {
        const allCarts = await cartManager.getCarts()
        const cindex = allCarts.findIndex(c=> c.id === cid)
        if(cindex === -1){
            return res.status(400).send({status: "error", message: "no se encontro el carrito"})
        } else{
            const cart = await cartManager.getCartProducts(cid)
            return res.send({status: "success", payload: cart})
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
        const allCarts = await cartManager.getCarts()
        const cindex = allCarts.findIndex(c=> c.id === cid)
        if(cindex === -1){
            return res.status(400).send({status: "error", message: "no se encontro el carrito"})
        } 

        const product = {
            id: pid,
            quantity: 1
        }

        const existProduct = allCarts[cindex].products.findIndex(p=> p.id === pid)

        if(existProduct !== -1){
            product.quantity + 1
            const addQuantiy = await cartManager.addQuantiyToProduct(cid,product)
            return res.send({status: "success", message: " Cantidades del producto Actualizadas"})
        }
        const addProduc = await cartManager.addProductCart(cid,product)
        res.send({status: "success", message: `Nuevo producto agregado al carrito ${cid}`}) 
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
    } 
})
export default router;