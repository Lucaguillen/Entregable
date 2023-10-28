import express from "express";
import productsRouter from "./Routes/products.routes.js"
import cartsRouter from "./Routes/carts.routes.js"
import handlebars from "express-handlebars"
import __dirname from "./utils.js";
import viewsRouter from "./Routes/views.router.js"
import { Server } from "socket.io";
import ProductManager from "../src/dao/dbManagers/products.manager.js";
import mongoose from "mongoose";
import MessageManager from "./dao/dbManagers/message.manager.js";

const productManager = new ProductManager();
const messageManager = new MessageManager()

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// DB CONNECTION
try {
    await mongoose.connect("mongodb+srv://lucaguillen:Lucamoizo2@coderlucaguillen.ivruvl3.mongodb.net/ecommerce?retryWrites=true&w=majority")
    console.log("db connected")
} catch (error) {
    console.log(error.message)
}

//handlebars
app.engine("handlebars", handlebars.engine())
app.set("views", `${__dirname}/views`)
app.set("view engine","handlebars")

app.use("/",viewsRouter)
app.use("/chat",viewsRouter)
app.use("/realtimeproducts", viewsRouter)
app.use(express.static(`${__dirname}/public`))

const server = app.listen(8080,()=>console.log("Listening on 8080"))

const socketServer = new Server(server)
app.set("socketio", socketServer)

socketServer.on('connection', async socket => {
    console.log('Nueva coneccion');

    //CHAT
    socket.on("message", async data =>{
        const save = await messageManager.saveMesssage(data)
        const allMessages = await messageManager.getAll()
        socketServer.emit("messageLogs",allMessages)
    })

    
    socket.on("autenticado", async user =>{
        const allMessages = await messageManager.getAll()
        socket.emit("messageLogs",allMessages)
    })

    //PRODUCTOS
    
    socketServer.emit('showproducts', await productManager.getProducts());


    socket.on('agregarProducto', async (newProduct) => {
        try {
    
            if(!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.stock || !newProduct.category){
                return res.status(400).send({status: "error", message: "valores incompletos"})
            }
            
            const allProducts = await productManager.getProducts();
        
            if(allProducts.length === 0){
                newProduct.pid = 1;
            }else{
                newProduct.pid = allProducts[allProducts.length -1].pid + 1;
            }
            
            if (allProducts.some(p => p.code === newProduct.code)){
                return res.status(400).send({ status: "error", error: "ya existe un producto con ese codigo"})
            }if ((isNaN(newProduct.price) || newProduct.price <= 0) || (isNaN(newProduct.stock) || newProduct.stock <= 0)) {
                return res.status(400).send({ status: "error", error: "El precio y el stock deben ser números válidos y mayores que cero"})
            }
            
            if (newProduct.status !== "false") {
                newProduct.status = true;
            }else{
                newProduct.status = false;
            }

            try {
                const addedProduct = await productManager.addProduct(newProduct)
                socketServer.emit('showproducts', await productManager.getProducts());
                return console.log({status: "success", message: "producto creado"})
            } catch (error) {
                console.error(error);
                return console.log({ status: "error", error: "Ocurrió un error en el servidor" });
            }

        } catch (error) {
            console.error(error);
            console.log({ status: "error", error: "Ocurrió un error en el servidor" });
        }
    });

    
    socket.on('deleteproduct', async (data) => {
        try {
            const id = Number(data)
            const result = await productManager.deleteProductByPid(id);
            if(!result){
                return console.log({status: "error", message:"Producto no encontrado"});
            } 
            
            socketServer.emit('showproducts', await productManager.getProducts());
            console.log(`El Producto con el id ${id} fue exitosamente eliminado`)
        } catch {

        }
    });

});
