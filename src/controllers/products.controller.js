import { EErrors } from "../config/enumns.js";
import CustomErrors from "../middlewares/errors/CustomErrors.js";
import { addProductService, deleteProductService, getAllPaginateService, getProductsByIdService, getProductsService, updateProductService, getMockProducts } from "../services/products.services.js"

const mockProducts = async  (req, res)=>{
    try {
        const result = await getMockProducts()
        res.send({
            status: "ok",
            counter: result.length,
            data: result
        })
        
    } catch (error) {
        throw CustomErrors.createError({
            name: "Error en el Servidor",
            cause: "Ocurrio un error en el servidor",
            message: "Al intentar obtener todos los productos mockeados ocurrio un error interno en el servidor",
            code: EErrors.INTERNAL_SERVER_ERROR
        })
    }
}



const deleteProduct = async  (req, res)=>{
    const {id} = req.params;
    const product = await getProductsByIdService(id)
    const userRole = req.user.role
    const userEmail = req.user.email

    if ((userRole === "premium") && (userEmail != product.owner)){
        throw CustomErrors.createError({
            name: "No puedes eliminar este producto",
            cause: "No eres el creador de este producto",
            message: "Error al intentar eliminar un producto del que el usuario no es el creador",
            code: EErrors.CONFLICT_ERROR
        });
    }

    try {
        const result = await deleteProductService(id)
        if(!result){
            throw CustomErrors.createError({
                name: "Producto no encontrado",
                cause: "No se encuentra producto con esa ID",
                message: "el producto que se intenta eliminar no se encuentra en la base de datos",
                code: EErrors.PRODUCT_NOT_FOUND
            })
        }
            
        const socketServer = req.app.get("socketio")
        return res.send(`El Producto con el id ${id} fue exitosamente eliminado`)
    } catch (error) {
        throw CustomErrors.createError({
            name: "Error en el Servidor",
            cause: "Ocurrio un error en el servidor",
            message: "Al intentar eliminar un producto ocurrio un error interno en el servidor",
            code: EErrors.INTERNAL_SERVER_ERROR
        })
    }
}

const updateProduct = async  (req, res)=>{
    const products = await getProductsService();
    const {id} = req.params;
    const productToUpdate = req.body
    const existProduct = await getProductsByIdService(id)

    if (!existProduct){
        throw CustomErrors.createError({
            name: "Producto no encontrado",
            cause: "No se encuentra producto con esa ID",
            message: "el producto que se intenta actualizar no se encuentra en la base de datos",
            code: EErrors.PRODUCT_NOT_FOUND
        })
    }
    try {
        const result = await updateProductService(productToUpdate,id)
        return res.send(`El producto con el id ${id} fue exitosamente Actualizado`)
    } catch (error) {
        throw CustomErrors.createError({
            name: "Error en el Servidor",
            cause: "Ocurrio un error en el servidor",
            message: "Al intentar actualizar un producto ocurrio un error interno en el servidor",
            code: EErrors.INTERNAL_SERVER_ERROR
        })
    }
}

const createProduct = async  (req, res) => {
    
    const {title, description, code, price, stock, category, thumbnails, status } = req.body
    
    if(!title || !description || !code || !price || !stock || ! category){
        throw CustomErrors.createError({
            name: "Valores incompletos",
            cause: "Faltan valores a la hora de crear producto",
            message: "El producto no pudo ser creado por falta de valores",
            code: EErrors.INVALID_TYPE_ERROR
        })

    }
    
    const allProducts = await getProductsService();

    
    if (allProducts.some(p => p.code === req.body.code)){
        throw CustomErrors.createError({
            name: "Producto existente",
            cause: "Se intento registrar un producto ya existente",
            message: "ya existe un producto con ese codigo",
            code: EErrors.CONFLICT_ERROR
        })
    }if ((isNaN(req.body.price) || req.body.price <= 0) || (isNaN(req.body.stock) || req.body.stock <= 0)) {
        throw CustomErrors.createError({
            name: "Valores incorrectos",
            cause: "Existen valores incorrectos a la hora de crear producto",
            message: "El precio y el stock deben ser números válidos y mayores que cero",
            code: EErrors.INVALID_TYPE_ERROR
        })
    }
    
    const userEmail = req.user.email
    const productCreated = req.body

    try {
        const addedProduct = await addProductService(userEmail, productCreated)
        return res.send({status: "success", message: "producto creado"})
    } catch (error) {
        throw CustomErrors.createError({
            name: "Error en el Servidor",
            cause: "Ocurrio un error en el servidor",
            message: error.message,
            code: EErrors.INTERNAL_SERVER_ERROR
        })
    }
    
}

const getByID = async  (req, res) => {
    try {
        const {id} = req.params;
        const result = await getProductsByIdService(id)
        if(!result) return res.status(404).send({status: "error", message:"Producto no encontrado"});
        res.send(result);
    } catch (error) {
        throw CustomErrors.createError({
            name: "Error en el Servidor",
            cause: "Ocurrio un error en el servidor",
            message: "Al intentar obtener un producto por su ID ocurrio un error interno en el servidor",
            code: EErrors.INTERNAL_SERVER_ERROR
        })
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
        throw CustomErrors.createError({
            name: "Error en el Servidor",
            cause: "Ocurrio un error en el servidor",
            message: "Al intentar obtener todos los productos paginados ocurrio un error interno en el servidor",
            code: EErrors.INTERNAL_SERVER_ERROR
        })
    }
    
}
export{
    getAll,
    getByID,
    createProduct,
    updateProduct,
    deleteProduct,
    mockProducts

}