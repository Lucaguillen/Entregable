import express from "express";
import productsRouter from "./Routes/products.routes.js"
import cartsRouter from "./Routes/carts.routes.js"
import handlebars from "express-handlebars"
import __dirname from "./utils.js";
import viewsRouter from "./Routes/views.router.js"
import { Server } from "socket.io";
import ProductManager from "../src/managers/products.manager.js";

const productManager = new ProductManager(`${__dirname}/managers/files/Productos.json`);

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//handlebars
app.engine("handlebars", handlebars.engine())
app.set("views", `${__dirname}/views`)
app.set("view engine","handlebars")

app.use("/",viewsRouter)
app.use("/realtimeproducts", viewsRouter)
app.use(express.static(`${__dirname}/public`))

const server = app.listen(8080,()=>console.log("Listening on 8080"))

const socketServer = new Server(server)
app.set("socketio", socketServer)

socketServer.on('connection', async socket => {
    console.log('Nueva coneccion');
    socketServer.emit('showproducts', await productManager.getProducts());


    socket.on('agregarProducto', async (data) => {
        try {
            const result = await productManager.addProduct(data);
            if (result.status === "error"){
                return console.error(result.error)
            }else if(result.status === "success"){
                 console.log(result.message)
            }
            socketServer.emit('showproducts', await productManager.getProducts());
        } catch (error) {
            console.error(error);
            console.log({ status: "error", error: "Ocurrió un error en el servidor" });
        }
    });

    
    socket.on('deleteproduct', async (data) => {
        try {
            const id = Number(data)
            const result = await productManager.deleteProduct(id);
            if (result.status === "error"){
                return console.error(result.message)
            }else if(result.status === "success"){
                 console.log(result.message)
            }
            socketServer.emit('showproducts', await productManager.getProducts());
        } catch {

        }
    });

});
