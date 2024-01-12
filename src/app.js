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


});
