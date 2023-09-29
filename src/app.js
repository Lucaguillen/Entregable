import express from "express";

import productsRouter from "./Routes/products.routes.js"
/* import cartsRouter from "./Routes/carts.routes.js" */



const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}));

app.use("/api/products", productsRouter);
/* app.use("/api/carts", cartsRouter); */







app.listen(8080,()=>console.log("Listening on 8080"))