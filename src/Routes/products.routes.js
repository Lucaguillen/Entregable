import Router from "./router.js"
import { __dirname } from "../utils.js";
import ProductManager from "../dao/dbManagers/products.manager.js";
import { productsModel } from "../dao/dbManagers/models/products.model.js"; //
import { accessRolesEnum, passportStrategiesEnum } from "../config/enumns.js";

export default class ProductsRouter extends Router{
    constructor(){
        super()
        this.productManager = new ProductManager()
    }

    init(){

        this.get("/", [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.getAll)
        this.get("/:id", [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.getByID)
        this.post("/", [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.createProduct)
        this.put("/:id", [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.updateProduct)
        this.delete("/:id", [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.deleteProduct)
    }

    async deleteProduct (req, res){
        try {
            const {id} = req.params;
            const result = await this.productManager.deleteProduct(id)
            if(!result) return res.status(404).send({status: "error", message:"Producto no encontrado"});
            const socketServer = req.app.get("socketio")
            socketServer.emit('showproducts', await this.productManager.getProducts());
            return res.send(`El Producto con el id ${id} fue exitosamente eliminado`)
        } catch (error) {
            console.error(error);
            res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
        }
    }

    async updateProduct (req, res){
        const products = await this.productManager.getProducts();
        const {id} = req.params;
        const productToUpdate = req.body
        const existProduct = await this.productManager.getProductsById(id)
    
        if(!productToUpdate.title || !productToUpdate.description || !productToUpdate.code ||
             !productToUpdate.price || !productToUpdate.stock || !productToUpdate.category){
            return res.status(400).send({status: "error", message: "valores incompletos"})
        }
        
        if (products.some(p => p.code === productToUpdate.code)){
            return res.status(400).send({ status: "error", error: "ya existe un producto con ese codigo"})
        } 
        if (!existProduct){
            return res.status(400).send({status: "error", error:"no se encontro ningun producto con ese ID"})
        }
        try {
            const result = await this.productManager.updateProduct(productToUpdate, id )
            const socketServer = req.app.get("socketio")
            socketServer.emit('showproducts', await this.productManager.getProducts());
            return res.send(`El producto con el id ${id} fue exitosamente Actualizado`)
        } catch (error) {
            console.error(error);
            res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
        }
    }

    async createProduct (req, res){
    
        const {title, description, code, price, stock, category, thumbnails, status } = req.body
        
        if(!title || !description || !code || !price || !stock || ! category){
            return res.status(400).send({status: "error", message: "valores incompletos"})
        }
        
        const allProducts = await this.productManager.getProducts();
    
        
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
            const addedProduct = await this.productManager.addProduct(req.body)
            const socketServer = req.app.get("socketio")
            socketServer.emit('showproducts', await this.productManager.getProducts());
            return res.send({status: "success", message: "producto creado"})
        } catch (error) {
            console.error(error);
            res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
        }
        
    }

    async getByID (req, res){
        try {
            const {id} = req.params;
            const result = await this.productManager.getProductsById(id);
            if(!result) return res.status(404).send({status: "error", message:"Producto no encontrado"});
            res.send(result);
        } catch (error) {
            console.error(error);
            res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
        }
        
    }

    async getAll (req, res) {
        const { limit, page, sort, query, queryvalue} = req.query;
        
        try {
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
    
            const products = await productsModel.paginate(filter, options);//////
            let prevLink = ""
            let nextLink = ""
            if (products.hasPrevPage) {
                prevLink = `localhost:8080/api/products?page=${products.prevPage}`;
            }else{
                prevLink = null
            }
            
            if (products.hasNextPage) {
                nextLink = `localhost:8080/api/products?page=${products.nextPage}`;
            }else{
                nextLink = null
            }
    
            
            return res.send({
                status: "success",
                payload: products,
                prevLink,
                nextLink
    
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
        }
    }
}







