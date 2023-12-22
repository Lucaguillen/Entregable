import mongoose from "mongoose";

const cartsCollection = "carts"

const cartsSchema = new mongoose.Schema({
    productsCart: {
        type: [
            {
                productID: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products",
                },
                quantity: {
                    type: Number,
                    default: 0 
                },
                
            }
            
        ],
        default: []
        
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    }
});
export const cartsModel = mongoose.model(cartsCollection, cartsSchema)