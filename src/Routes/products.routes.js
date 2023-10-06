import { Router } from "express";
import __dirname from "../utils.js";
import ProductManager from "../managers/products.manager.js";
import fs from "fs";

const productManager = new ProductManager(`${__dirname}/managers/files/Productos.json`);

const router = Router()

router.get("/", async (req, res) => {
    const queryParams = Number(req.query.limit);
    try {
        const products = await productManager.getProducts();
        if(!queryParams||queryParams > products.length||queryParams<= 0) return res.send(products);
        const filteredLimit = products.filter(p=>p.id<=queryParams)
        res.send(filteredLimit)
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
    }
    
})

router.get("/:pid", async (req, res)=>{
    const pid = Number(req.params.pid);
    try {
        const result = await productManager.getProductsById(pid);
        if(result.status === "error") return res.status(404).send(result);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
    }
    
})

router.post("/", async (req, res) =>{
    const product = req.body;
    try {
        const result = await productManager.addProduct(product);
        if (result.status === "error"){
            return res.status(400).send(result)
        }else if(result.status === "success"){
            const socketServer = req.app.get("socketio")
            socketServer.emit('showproducts', await productManager.getProducts());
            return res.send({status: "success", message: "producto creaado"})
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
    }
    
})

router.put("/:pid", async (req, res)=>{
    const product = req.body;
    const pid = Number(req.params.pid)
    try {
        const result = await productManager.updateProduct(product,pid);
        if (result.status === "success"){
            const socketServer = req.app.get("socketio")
            socketServer.emit('showproducts', await productManager.getProducts());
            res.send(result)
        }else if (result.status === "error" && (result.error === "valores incompletos" || result.error === "no se puede modificar el ID" ||result.error === "ya existe un producto con ese codigo" )){
            return res.status(400).send(result)
        }else{
            return res.status(404).send(result)
        }     
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
    }
})


router.delete("/:pid", async (req, res) =>{
    const pid = Number(req.params.pid)
    try {
        const result = await productManager.deleteProduct(pid);
        if (result.status === "error"){
           return res.status(404).send(result)
        }if (result.status === "success"){
            const socketServer = req.app.get("socketio")
            socketServer.emit('showproducts', await productManager.getProducts());
            return res.send(result)
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
    }
    
})

export default router;