import fs from "fs";
import __dirname from "../../utils.js";
import { cartsModel } from "./models/carts.model.js";

 
export default class CartManager {
    constructor(path) {
        this.path = path;
    }
    getCarts = async () => {
        const carts = await cartsModel.find().lean()
        return carts
    }  
    createCart = async (newCart) =>{
        try {
            const cartAdded = await cartsModel.create(newCart)
            return cartAdded
            
        } catch (error) {
            console.error(error);
        }
    }
    getCartProducts = async (cid)=>{
       const cart = await cartsModel.findOne(
        {id: cid}
       ).select("products").lean()
       return cart
    }
    addProductCart = async (cid,product) => {
        const result = await cartsModel.findOneAndUpdate(
            { id: cid },
            { $push: { products: product } },
        );
    }

    addQuantiyToProduct = async(cid,product) => {
        const cart = await cartsModel.findOneAndUpdate(
            { id: cid, "products.id": product.id },
            { $inc: { "products.$.quantity": 1 } }
        );
        
    }
} 
