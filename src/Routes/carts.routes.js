import Router from "./router.js"
import { __dirname } from "../utils.js";
import CartManager from "../dao/dbManagers/cart.manager.js";
import mongoose from "mongoose";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enumns.js";

export default class CartRouter extends Router {
    constructor(){
        super()
        this.cartManager = new CartManager()
    }
    init(){
        this.post("/", [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.createOne)//
        this.get("/:cid",[accessRolesEnum.USER], passportStrategiesEnum.JWT, this.cartbyid)//
        this.post("/product/:pid", [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.addProdToCart)//
        this.post("/removeQuantity/:pid", [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.removeQuantiyToProduct)//
        this.delete("/remove/:pid",[accessRolesEnum.USER], passportStrategiesEnum.JWT, this.deleteProdToCart)//
        this.delete("/empty/:cid",[accessRolesEnum.USER], passportStrategiesEnum.JWT, this.emptyCart)//
        /* this.put("/:cid",[accessRolesEnum.USER], passportStrategiesEnum.JWT, this.updateCartArray)
        this.put("/:cid/product/:pid", [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.updateQuantiyToProduct) */
    }



    async createOne (req,res) {
        try {
            
            const newCart = {productsCart: []};
            
            await this.cartManager.createCart(newCart)
            res.send({status: "success", message: "Nuevo carrito creado"})
        } catch (error) {
            console.error(error);
            res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
        }
    }
    
    async cartbyid (req, res){
        const {cid} = req.params
        try {
            const cartbyid = await this.cartManager.getCartsByID(cid)
            if(!cartbyid){
                return res.status(400).send({status: "error", message: "no se encontro el carrito"})
            } else{
                const cart = await this.cartManager.getCartProducts(cid)
                
                return res.send({status: "success", payload: cart})
            }
    
        } catch (error) {
            console.error(error);
            res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
        } 
    }
    
    async addProdToCart (req, res){
        const user = req.user
        const cid = user.cart.id;
        const {pid} = req.params
        try {
            const cartbyid = await this.cartManager.getCartsByID(cid)
            if(!cartbyid){
                return res.status(400).send({status: "error", message: "no se encontro el carrito"})
            } 
    
            const product = {
                productID: pid,
                quantity: 1,
            }
    
            const existProduct = cartbyid.productsCart.findIndex(p => p.productID.equals(pid));
            
            if(existProduct !== -1){
                const addQuantiy = await this.cartManager.addQuantiyToProduct(cid,product)
                return res.send({status: "success", message: " Cantidades del producto Actualizadas"})
            }
            const addProduc = await this.cartManager.addProductCart(cid,product)
            res.send({status: "success", message: `Nuevo producto agregado al carrito ${cid}`}) 
        } catch (error) {
            console.error(error);
            res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
        } 
    }
    async removeQuantiyToProduct (req,res){
        try {
            const user = req.user
            const cid = user.cart.id;
            const {pid} = req.params
            const cartbyid = await this.cartManager.getCartsByID(cid)
            if(!cartbyid){
                return res.status(400).send({status: "error", message: "no se encontro el carrito"})
            } 
            const productToUpdate = cartbyid.productsCart.find(p => p.productID.equals(pid));
            if(productToUpdate.quantity <= 1){
                const removeProduct = await this.cartManager.deleteCartProduct(cid,pid)
                return res.send({status: "success", message: " Producto eliminado del carrito"})
            }else{
                const removeQuantiy = await this.cartManager.removeQuantiyToProduct(cid,pid)
                return res.send({status: "success", message: " Cantidades del producto Actualizadas"})
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
        }
        
        
    }

    async deleteProdToCart (req,res){
        try {
            const user = req.user
            const cid = user.cart.id;
            const {pid} = req.params
            const cartbyid = await this.cartManager.getCartsByID(cid)
            if(!cartbyid){
                return res.status(400).send({status: "error", message: "no se encontro el carrito"})
            } 
            const productToUpdate = cartbyid.productsCart.find(p => p.productID.equals(pid));
            if(productToUpdate){
                const removeProduct = await this.cartManager.deleteCartProduct(cid,pid)
                return res.send({status: "success", message: " Producto eliminado del carrito"})
            }else{
                return res.status(400).send({status: "error", message: " No se encontro el producto"})
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
        }
         
    }
    async emptyCart (req, res){
        const {cid} = req.params
        try {
            const cartbyid = await this.cartManager.getCartsByID(cid)
            if(!cartbyid){
                return res.status(400).send({status: "error", message: "no se encontro el carrito"})
            } 
            const deleteProduct = await this.cartManager.emptyCart(cid)
            res.send({status: "success", message: `Carrito vaciado`}) 
        } catch (error) {
            console.error(error);
            res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
        } 
    }
    
   /*  async updateCartArray (req, res){
        const {cid} = req.params
        const products = req.body
        try {
            const cartbyid = await this.cartManager.getCartsByID(cid)
            if(!cartbyid){
                return res.status(400).send({status: "error", message: "no se encontro el carrito"})
            }
            const duplicatesExist = products.some(p => cartbyid.productsCart.some(c => c.productID.equals(p.productID)));
            if(!duplicatesExist){
                await this.cartManager.updateCartArray(cid,products)
                return res.send({status: "success", message: "Carrito actualizado"})
            }else{
                return res.status(400).send({status: "error", message: "Hay productos que ya existen en el carrito"})
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
        } 
    }
    
    async updateQuantiyToProduct (req, res){
        const {cid} = req.params
        const {pid} = req.params
        const quantity = req.body
        const quantityValue = quantity.quantity
    
        try {
            const cartbyid = await this.cartManager.getCartsByID(cid)
            if(!cartbyid){
                return res.status(400).send({status: "error", message: "no se encontro el carrito"})
            } 
            const indexProduct = cartbyid.productsCart.findIndex(p => p.productID.equals(pid));
            if(indexProduct === -1){
                return res.status(400).send({status: "error", message: "no se encontro el producto"})
            }
            const newQuantity = await this.cartManager.updateQuantiyToProduct(cid,pid,quantityValue)
            res.send({status: "success", message: `Cantidad del producto actualizada`}) 
        } catch (error) {
            console.error(error);
            res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
        } 
    } */
    

}






