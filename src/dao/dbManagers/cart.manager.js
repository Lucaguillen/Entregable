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
    getCartsByID = async (cid) => {
        const carts = await cartsModel.findById(cid)
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
        const cart = await cartsModel
        .findOne({ _id: cid })
        .populate({
            path: 'productsCart.productID',
            model: 'products'
        })
        .lean();
       return cart
    }
    deleteCartProduct = async (cid, pid) => {
        const deleted = await cartsModel.updateOne(
          { _id: cid }, { $pull: { productsCart: { productID: pid } } }
        );
        return deleted;
    }
      
    addProductCart = async (cid,product) => {
        const result = await cartsModel.findOne({ _id: cid });
        result.productsCart.push(product)
        await result.save()
    }

    addQuantiyToProduct = async(cid,product) => {
        const cart = await cartsModel.findOneAndUpdate(
            { _id: cid, "productsCart.productID": product.productID },
            { $inc: { "productsCart.$.quantity": 1 } }
        );
        
    }
    updateCartArray = async(cid,products)=>{
        const updatedCart = await cartsModel.findByIdAndUpdate(
            { _id: cid},
            {$push: { productsCart: products } }
        )
    }
    updateQuantiyToProduct = async (cid, pid, quantityValue) => {
        const updatedCart = await cartsModel.findOneAndUpdate(
          {_id: cid,"productsCart.productID": pid},
          {$inc: { "productsCart.$.quantity": quantityValue }},
        );
        return updatedCart;
    }
    emptyCart = async (cid) =>{
        const emptyCart = await cartsModel.findOneAndUpdate(
            {_id: cid},
            {$set: { productsCart: [] } }
        );
        return emptyCart;
    }
} 
