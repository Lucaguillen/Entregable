import { addProductService, deleteProductService, getAllPaginateService, getProductsByIdService, getProductsService, updateProductService } from "../services/products.services.js"


const deleteProduct = async  (req, res)=>{
    try {
        const {id} = req.params;
        const result = await deleteProductService(id)
        if(!result) return res.status(404).send({status: "error", message:"Producto no encontrado"});
        const socketServer = req.app.get("socketio")
        socketServer.emit('showproducts', await getProductsService());
        return res.send(`El Producto con el id ${id} fue exitosamente eliminado`)
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
    }
}

const updateProduct = async  (req, res)=>{
    const products = await getProductsService();
    const {id} = req.params;
    const productToUpdate = req.body
    const existProduct = await getProductsByIdService(id)

    /* if(!productToUpdate.title || !productToUpdate.description || !productToUpdate.code ||
         !productToUpdate.price || !productToUpdate.stock || !productToUpdate.category){
        return res.status(400).send({status: "error", message: "valores incompletos"})
    }
    
    if (products.some(p => p.code === productToUpdate.code)){
        return res.status(400).send({ status: "error", error: "ya existe un producto con ese codigo"})
    }  */
    if (!existProduct){
        return res.status(400).send({status: "error", error:"no se encontro ningun producto con ese ID"})
    }
    try {
        const result = await updateProductService(productToUpdate,id)
        const socketServer = req.app.get("socketio")
        socketServer.emit('showproducts', await getProductsService());
        return res.send(`El producto con el id ${id} fue exitosamente Actualizado`)
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
    }
}

const createProduct = async  (req, res) => {
    
    const {title, description, code, price, stock, category, thumbnails, status } = req.body
    
    if(!title || !description || !code || !price || !stock || ! category){
        return res.status(400).send({status: "error", message: "valores incompletos"})
    }
    
    const allProducts = await getProductsService();

    
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
        const addedProduct = await addProductService(req.body)
        const socketServer = req.app.get("socketio")
        socketServer.emit('showproducts', await getProductsService());
        return res.send({status: "success", message: "producto creado"})
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
    }
    
}

const getByID = async  (req, res) => {
    try {
        const {id} = req.params;
        const result = await getProductsByIdService(id)
        if(!result) return res.status(404).send({status: "error", message:"Producto no encontrado"});
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
    }
    
}

const getAll = async  (req, res) => {
    const { limit, page, sort, query, queryvalue} = req.query;
    
    try {

        const products = await getAllPaginateService(limit, page, sort, query, queryvalue)
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
export{
    getAll,
    getByID,
    createProduct,
    updateProduct,
    deleteProduct
}