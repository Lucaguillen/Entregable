/* import fs from "fs";
import __dirname from "../../utils.js";


 
export default class CartManager {
    constructor(path) {
        this.path = path;
    }
    getCarts = async () => {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                const carts = JSON.parse(data);
                return carts;
            } else {
                return [];
            }
        } catch (error) {
            console.error(error);
        }
    }  
    createCart = async () =>{
        try {
            const carts = await this.getCarts()
            const cart = {
                products: []
            };
            if(carts.length === 0){
                cart.id = 1;
            }else{
                cart.id = carts[carts.length -1].id + 1;
            }
            carts.push(cart)
            await fs.promises.writeFile(`${__dirname}/managers/files/Carritos.json`, JSON.stringify(carts, null, '\t'));
            return {status: "success", message: "carrito createado"}
        } catch (error) {
            console.error(error);
        }
    }
    getCartProducts = async (cid)=>{
        try {
            const carts = await this.getCarts()
            const cindex = carts.findIndex(c=> c.id === cid)
            if(cindex === -1){
                return {status: "error", message: "no se encontro el carrito"}
            } else{
                return { status: "success", products: carts[cindex].products };
            }
        } catch (error) {
            console.error(error);
        }
    }
    addProductCart = async (cid,pid) => {
        try {
            const carts =  await this.getCarts();
            const cindex = carts.findIndex(c=> c.id === cid)
            if(cindex === -1) return {status: "error", message: "no se encontro el carrito"}
            const pindex = carts[cindex].products.findIndex(p=> p.id === pid)
            
            const product = {
                id: pid,
                quantity: 1
            }
            
            if(!carts[cindex].products.some(p => p.id === pid)){
                carts[cindex].products.push(product)
                await fs.promises.writeFile(`${__dirname}/managers/files/Carritos.json`, JSON.stringify(carts, null, '\t'));
                return {status: "success", message: "nuevo producto agregado al carrito"}
            }else{
                carts[cindex].products[pindex].quantity++
                await fs.promises.writeFile(`${__dirname}/managers/files/Carritos.json`, JSON.stringify(carts, null, '\t'));
                return {status: "success", message: "cantidad de producto actualizada"}
            }
        } catch (error) {
            console.error(error);
        }
    }
} 
 */