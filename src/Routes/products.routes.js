import { Router } from "express";
import ProductManager from "../managers/ProductsManager.js"

const productManager = new ProductManager("../managers/files/Productos.json");

const router = Router()

router.get("/", async (req, res) => {
    const queryParams = Number(req.query.limit);
    const products = await productManager.getProducts();
    console.log(products)
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

export default router;