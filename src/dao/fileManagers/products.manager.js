/* import fs from "fs";
import __dirname from "../../utils.js";


 
export default class ProductManager {
    constructor(path) {
        this.path = path;
    }
    getProducts = async () => {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                const products = JSON.parse(data);
                return products;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }  
    getProductsById= async (id)=> {
        try {
            const products = await this.getProducts()
            const productsFiltered = products.find((p)=> p.id === id);
            if(!productsFiltered){
                return { status: "error", error: 'Producto no encontrado' }
            }else{
                return productsFiltered;
            }
            
        } catch (error) {
            console.log(error)
        }
    }
    deleteProduct = async (id) => {
        try { 
            let products = await this.getProducts();
            const productToDelete = products.find((product) => product.id === id);
            if (!productToDelete) {
                return {status: "error", message: "no se encontro el producto"}
            }else{
                const updatedProducts = products.filter((product) => product.id !== id);
                await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts, null, '\t'));
                return {status: "success", message: "producto eliminado"}
            }
        } catch (error) {
            console.log(error)
        }
    }
    addProduct = async (product) => {
        try {
            const products = await this.getProducts()
            if (products.some(p => p.code === product.code)){
                return { status: "error", error: "ya existe un producto con ese codigo"}
            }else if (!product.title ||!product.description ||!product.code ||!product.price
                ||!product.stock ||!product.category){
                return { status: "error", error: "valores incompletos"}
            }
            
            if ((isNaN(product.price) || product.price <= 0) || (isNaN(product.stock) || product.stock <= 0)) {
                return { status: "error", error: "El precio y el stock deben ser números válidos y mayores que cero" };
            }
            

            if (product.status !== "false") {
                product.status = true;
            }else{
                product.status = false;
            }
            
            if(products.length === 0){
                product.id = 1;
            }else{
                product.id = products[products.length -1].id + 1;
            }
            products.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            return {status: "success", message: "producto creaado"}
        } catch (error) {
            console.log(error)
        }
    }
    updateProduct = async (product,pid) =>{
        try {
            const products = await this.getProducts()
            if (!product.title ||!product.description ||!product.code ||!product.price
                ||!product.stock ||!product.category){
                return { status: "error", error: "valores incompletos"}}
            if (product.id){
                return { status: "error", error: "no se puede modificar el ID"}
            }
            if (products.some(p => p.code === product.code)){
                return { status: "error", error: "ya existe un producto con ese codigo"}
            }     
            if (!product.hasOwnProperty('status')) {
                product.status = true;
            }
            const index = products.findIndex(p => p.id === pid)
            if (index !== -1){
                const productComplete = {id: pid,...product}
                products[index] = productComplete
                await fs.promises.writeFile(`${__dirname}/managers/files/Productos.json`, JSON.stringify(products, null, '\t'));
                return {status: "success", message: "producto actualizado"}
            }else{
                return {status: "error", message: "no se encontro el producto"}
            }
        } catch (error) {
            console.error(error)
        }
    }
    
}  */




