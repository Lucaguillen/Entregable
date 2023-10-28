import mongoose from "mongoose";

const productsCollection = "products"

const productsSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: Number,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    thumbnails: {
        type: Array,
        default: []
    },
    status: {
        type: Boolean,
        default: false
    },
    pid:{
        type: Number
    }

})

export const productsModel = mongoose.model(productsCollection, productsSchema)