import {addProductCart, addQuantiyToProduct, createNewCart, existProduct, getCartProducts, getCartsByID, removeQuantiyService, removeProduct, emptyCartService, purchaseService, updateCartArrayService,getProductsByIdService} from "../services/cart.services.js"
const purchase = async (req, res) =>{
    try {
        const {cid} = req.params
        const cartbyid = await getCartsByID(cid)
        const userEmail = cartbyid.userId.email
        if(!cartbyid){
            req.logger.error("no se encontro el carrito")
            return res.status(400).send({status: "error", message: "no se encontro el carrito"})
        }
        const purchase = await purchaseService(cid)
        res.redirect(`/tiket/${userEmail}`)
    } catch (error) {
        req.logger.fatal(error.message)
        res.sendClientError(error.message)
    }
}

const createOne = async  (req,res) => {
    try {
        await createNewCart()
        res.send({status: "success", message: "Nuevo carrito creado"})
    } catch (error) {
        req.logger.fatal(error.message)
        res.sendClientError(error.message)
    }
}

const cartbyid  = async (req, res) => {
    const {cid} = req.params
    try {
        const cartbyid = await getCartsByID(cid)
        if(!cartbyid){
            req.logger.error("no se encontro el carrito")
            return res.status(400).send({status: "error", message: "no se encontro el carrito"})
        } else{
            const cart = await getCartProducts(cid)
            return res.send({status: "success", payload: cart})
        }

    } catch (error) {
        req.logger.fatal(error.message)
        res.sendClientError(error.message)
    } 
}

const addProdToCart = async (req, res) => {
    const user = req.user
    const cid = user.cart.id._id;
    const {pid} = req.params
    const product = await getProductsByIdService(pid)
    

    if((user.role === "premium") && (user.email === product.owner)){
        return res.status(409).send({status: "error", message: "No puedes comprar un producto que tu mismo creaste"})
    }

    try {
        const cartbyid = await getCartsByID(cid)
        if(!cartbyid){
            req.logger.error("no se encontro el carrito")
            return res.status(400).send({status: "error", message: "no se encontro el carrito"})
        } 
        const existProductValue = await existProduct(pid,cid)
        if(existProductValue){
            const addQuantiyValue = await addQuantiyToProduct(cid, existProductValue)
            return res.send({status: "success", message: " Cantidades del producto Actualizadas"})
        }
        const addProduct = addProductCart(pid,cid)
        res.send({status: "success", message: `Nuevo producto agregado al carrito ${cid}`}) 
    } catch (error) {
        req.logger.fatal(error.message)
        res.sendClientError(error.message)
    } 
}
const removeQuantiyToProduct = async  (req,res) => {
    const user = req.user
    const cid = user.cart.id._id;
    const {pid} = req.params
    try {
        const cartbyid = await getCartsByID(cid)
        if(!cartbyid){
            req.logger.error("no se encontro el carrito")
            return res.status(400).send({status: "error", message: "no se encontro el carrito"})
        }
        const removeResult = await removeQuantiyService(cid, pid)
        return res.send({status: "success", message: " Cantidades del producto Actualizadas"})
    } catch (error) {
        req.logger.fatal(error.message)
        res.sendClientError(error.message)
    }
    
    
}
const deleteProdToCart = async (req,res) => {
    const user = req.user
    const cid = user.cart.id._id;
    const {pid} = req.params
    try {
        const cartbyid = await getCartsByID(cid)
        if(!cartbyid){
            req.logger.error("no se encontro el carrito")
            return res.status(400).send({status: "error", message: "no se encontro el carrito"})
        }
        const removeResult = await removeProduct(cid, pid)
        return res.send({status: "success", message: " Producto eliminado"})
    } catch (error) {
        req.logger.fatal(error.message)
        res.sendClientError(error.message)
    }
     
}

const emptyCart = async (req, res) => {
    const {cid} = req.params
    try {
        const cartbyid = await getCartsByID(cid)
        if(!cartbyid){
            req.logger.error("no se encontro el carrito")
            return res.status(400).send({status: "error", message: "no se encontro el carrito"})
        }
        const deleteProduct = await emptyCartService(cid)
        res.send({status: "success", message: `Carrito vaciado`}) 
    } catch (error) {
        req.logger.fatal(error.message)
        res.sendClientError(error.message)
    } 
}

const updateCartArray = async (req, res) =>{
    const {cid} = req.params
    try {
        const cartbyid = await getCartsByID(cid)
        if(!cartbyid){
            req.logger.error("no se encontro el carrito")
            return res.status(400).send({status: "error", message: "no se encontro el carrito"})
        }
        const updateArray = await updateCartArrayService(cid)
        res.send({status: "success", message: `Productos del carrito actualizados`}) 
    } catch (error) {
        req.logger.fatal(error.message)
        res.sendClientError(error.message)
    }
}

export {
    createOne,
    cartbyid,
    addProdToCart,
    removeQuantiyToProduct,
    deleteProdToCart,
    emptyCart,
    purchase,
    updateCartArray
}