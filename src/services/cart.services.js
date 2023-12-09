import CartManager from "../dao/dbManagers/cart.manager.js"
const cartManager = new CartManager()

const createNewCart = async () =>{
    const newCart = {productsCart: []};
    await cartManager.createCart(newCart)
}

const getCartsByID = async (cid) =>{
    const cart = await cartManager.getCartsByID(cid)
    return cart
}

const getCartProducts = async (cid) =>{
    const cart = await cartManager.getCartProducts(cid)
    return cart
}

const existProduct = async (pid,cid) =>{
    const cartbyid = await cartManager.getCartsByID(cid)
    const product = {
        productID: pid,
        quantity: 1,
    }
    const existProduct = cartbyid.productsCart.find(p => p.productID.equals(pid));
    return existProduct
}

const addQuantiyToProduct = async (cid, product) => {
    const addQuantiy = await cartManager.addQuantiyToProduct(cid,product)
}

const addProductCart = async (pid,cid) =>{
    const product = {
        productID: pid,
        quantity: 1,
    }
    const addProduct = await cartManager.addProductCart(cid,product)

}
const removeQuantiyService = async (cid, pid) =>{
    const cartbyid = await cartManager.getCartsByID(cid)
    const productToUpdate = cartbyid.productsCart.find(p => p.productID.equals(pid));
    if(productToUpdate.quantity <= 1){
        const removeProduct = await cartManager.deleteCartProduct(cid,pid)
        return removeProduct
    }else{
        const removeQuantiy = await cartManager.removeQuantiyToProduct(cid,pid)
        return removeQuantiy
    }
}

const removeProduct = async (cid, pid) => {
    const removeProduct = await cartManager.deleteCartProduct(cid,pid)
}

const emptyCartService = async (cid) => {
    const deleteProduct = await cartManager.emptyCart(cid)
}

export{
    createNewCart,
    getCartsByID,
    getCartProducts,
    existProduct,
    addQuantiyToProduct,
    addProductCart,
    removeQuantiyService,
    removeProduct,
    emptyCartService
}


