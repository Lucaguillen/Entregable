import mongoose from "mongoose";

const tiketsCollection = "tikets"

const tiketsSchema = new mongoose.Schema({
   code: String,
   purchase_datatime: Date,
   amount: Number,
   purchaser: String
});
export const TiketsModel = mongoose.model(tiketsCollection, tiketsSchema)