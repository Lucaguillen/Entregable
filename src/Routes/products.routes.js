import { Router } from "express";
import __dirname from "../utils.js";
import ProductManager from "../dao/dbManagers/products.manager.js";


const productManager = new ProductManager();

const router = Router()

router.get("/", async (req, res) => {
    const queryParams = Number(req.query.limit);
    try {
        const products = await productManager.getProducts();
        if(!queryParams||queryParams > products.length||queryParams<= 0) return res.send(products);
        const filteredLimit = products.filter(p=>p.pid<=queryParams)
        res.send(filteredLimit)
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
    }
})

router.get("/:id", async (req, res)=>{
    try {
        const {id} = req.params;
        const result = await productManager.getProductsById(id);
        if(!result) return res.status(404).send({status: "error", message:"Producto no encontrado"});
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
    }
    
})

router.post("/", async (req, res) =>{
    
    const {title, description, code, price, stock, category, thumbnails, status, pid } = req.body
    
    if(!title || !description || !code || !price || !stock || ! category){
        return res.status(400).send({status: "error", message: "valores incompletos"})
    }
    
    const allProducts = await productManager.getProducts();

    if(allProducts.length === 0){
        req.body.pid = 1;
    }else{
        req.body.pid = allProducts[allProducts.length -1].pid + 1;
    }
    
    if (allProducts.some(p => p.code === req.body.code)){
        return { status: "error", error: "ya existe un producto con ese codigo"}
    }if ((isNaN(req.body.price) || req.body.price <= 0) || (isNaN(req.body.stock) || req.body.stock <= 0)) {
        return { status: "error", error: "El precio y el stock deben ser números válidos y mayores que cero" };
    }
    
    if (req.body.status !== "false") {
        req.body.status = true;
    }else{
        req.body.status = false;
    }

    try {
        const addedProduct = await productManager.addProduct(req.body)
        const socketServer = req.app.get("socketio")
        socketServer.emit('showproducts', await productManager.getProducts());
        return res.send({status: "success", message: "producto creado"})
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
    }
    
})

router.put("/:id", async (req, res)=>{
    const products = await productManager.getProducts();
    const {id} = req.params;
    const productToUpdate = req.body
    const existProduct = await productManager.getProductsById(id)

    if(!productToUpdate.title || !productToUpdate.description || !productToUpdate.code ||
         !productToUpdate.price || !productToUpdate.stock || !productToUpdate.category){
        return res.status(400).send({status: "error", message: "valores incompletos"})
    }
    if (productToUpdate.pid){
        return res.status(400).send({ status: "error", error: "no se puede modificar el PID"})
    }
    if (products.some(p => p.code === productToUpdate.code)){
        return res.status(400).send({ status: "error", error: "ya existe un producto con ese codigo"})
    } 
    if (!existProduct){
        return res.status(400).send({status: "error", error:"no se encontro ningun producto con ese ID"})
    }
    try {
        const result = await productManager.updateProduct(productToUpdate, id )
        const socketServer = req.app.get("socketio")
        socketServer.emit('showproducts', await productManager.getProducts());
        return res.send(`El producto con el id ${id} fue exitosamente Actualizado`)
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
    }
})


router.delete("/:id", async (req, res) =>{
    try {
        const {id} = req.params;
        const result = await productManager.deleteProduct(id)
        if(!result) return res.status(404).send({status: "error", message:"Producto no encontrado"});
        const socketServer = req.app.get("socketio")
        socketServer.emit('showproducts', await productManager.getProducts());
        return res.send(`El Producto con el id ${id} fue exitosamente eliminado`)
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
    }
})

export default router;