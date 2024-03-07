import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2"

const usersCollection = 'users';

const usersSchema = new mongoose.Schema({
    first_name:{
        type: String,
        required: true
    },
    last_name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    age: Number,
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    },
    cart: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'carts'
        }
    },
    documents: {
        type: [
            
            {
                name: {type: String},
                reference: {type: String}
            }  
        ]
        
    },
    last_connection:{
        type: Date
    }
});
usersSchema.plugin(mongoosePaginate)
export const usersModel = mongoose.model(usersCollection, usersSchema);

