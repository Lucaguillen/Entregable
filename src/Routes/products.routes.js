import { Router } from "express";
import __dirname from "../utils.js";
import ProductManager from "../managers/products.manager.js";
import fs from "fs";

const productManager = new ProductManager(`${__dirname}/managers/files/Productos.json`);

const router = Router()

router.get("/", async (req, res) => {
    const queryParams = Number(req.query.limit);
    const products = await productManager.getProducts();
    if(!queryParams||queryParams > products.length||queryParams<= 0) return res.send(products);
    const filteredLimit = products.filter(p=>p.id<=queryParams)
    res.send(filteredLimit)
})

router.get("/:pid", async (req, res)=>{
    const products = await productManager.getProducts();
    const pid = Number(req.params.pid);
    const pfilter = products.find(p=>p.id === pid);
    if(!pfilter) return res.send({ error: 'Producto no encontrado' });
    res.send(pfilter);
})

router.post("/", async (req, res) =>{
    const products = await productManager.getProducts();
    const product = req.body;
    if (!product.title ||!product.description ||!product.code ||!product.price
    ||!product.stock ||!product.category){
    return res.status(400).send({ status: "error", error: "valores incompletos"})}
    if (!product.status) {
        product.status = true;
    }
    if (products.some(p => p.code === product.code)){
        return res.status(400).send({ status: "error", error: "ya existe un producto con ese codigo"})
    }
    if(products.length === 0){
        product.id = 1;
    }else{
        product.id = products[products.length -1].id + 1;
    }
    products.push(product)
    await fs.promises.writeFile(`${__dirname}/managers/files/Productos.json`, JSON.stringify(products, null, '\t'));
    res.send({status: "success", message: "producto createado"})
})

router.put("/:pid", async (req, res)=>{
    const products = await productManager.getProducts();
    const product = req.body;
    const pid = Number(req.params.pid)
    if (!product.title ||!product.description ||!product.code ||!product.price
        ||!product.stock ||!product.category){
        return res.status(400).send({ status: "error", error: "valores incompletos"})}
    if (product.id){
        return res.status(400).send({ status: "error", error: "no se puede modificar el ID"})
    }     
    if (!product.status) {
        product.status = true;
    }
    const index = products.findIndex(p => p.id === pid)
    if (index !== -1){
        const productComplete = {id: pid,...product}
        products[index] = productComplete
        await fs.promises.writeFile(`${__dirname}/managers/files/Productos.json`, JSON.stringify(products, null, '\t'));
        res.send({status: "success", message: "producto actualizado"})
    }else{
        res.status(404).send({status: "error", message: "no se encontro el producto"})
    }
})

router.delete("/:pid", async (req, res) =>{
    const products = await productManager.getProducts();
    const pid = Number(req.params.pid)
    const index = products.findIndex(p => p.id === pid)
    if (index !== -1){
        products.splice(index,1)
        await fs.promises.writeFile(`${__dirname}/managers/files/Productos.json`, JSON.stringify(products, null, '\t'));
        res.send({status: "success", message: "producto eliminado"})
    }else{
        res.status(404).send({status: "error", message: "no se encontro el producto"})
    }
})

export default router;