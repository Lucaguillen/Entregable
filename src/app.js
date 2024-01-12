import express from "express";
import ProductsRouter from "./Routes/products.routes.js"
import CartRouter from "./Routes/carts.routes.js"
import handlebars from "express-handlebars"
import { __dirname, addLogger } from "./utils.js";
import ViewsRouter from "./Routes/views.routes.js"
import { Server } from "socket.io";
import UsersRouter from "./Routes/users.routes.js";
import session from "express-session";
import { initializePassport } from "./config/passport.config.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import config from "../config.js";
import { CartManager, MessageManager, ProductManager } from "./dao/factory.js";
import errorHandler from "./middlewares/errors/index.js"



const productManager = new ProductManager();
const messageManager = new MessageManager()
const cartManager = new CartManager()

const cartRouter = new CartRouter()
const usersRouter = new UsersRouter()
const viewsRouter = new ViewsRouter()
const productsRouter = new ProductsRouter()


const app = express();

app.use(addLogger)

app.use(express.json())
app.use(express.urlencoded({extended: true}));

// sesionss

app.use(cookieParser())

app.use(session({
    secret: 'Secreto12345',
    resave: true, 
    saveUninitialized: true, 
}));

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use("/api/products", productsRouter.getRouter());
app.use("/api/carts", cartRouter.getRouter());
app.use('/api/sessions', usersRouter.getRouter());
app.use("/",viewsRouter.getRouter())


app.use(errorHandler);

//handlebars
app.engine("handlebars", handlebars.engine())
app.set("views", `${__dirname}/views`)
app.set("view engine","handlebars")


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

    socket.on("addToCartBtn", async pid =>{
        const cart = await cartManager.getCartsByID("6544e501bef87d7997ccea14")
        console.log(cart)
       
    })

    
    
    //realtimep´roducts
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
