import fs from "fs";

 
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
                console.log("No existen productos con ese ID")
            }else{
                console.log("Su producto filtrado es:");
                console.log(productsFiltered);
                return productsFiltered;
            }
            
        } catch (error) {
            console.log(error)
        }
    }
    deleteProduct = async (id) =>{
        let products = await this.getProducts()
        let productDeleted = products.filter(p => p.id !==id)
        products = productDeleted
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
    }
    updateProduct = async (updatedProduct)=>{
        try {
            const id = updatedProduct.id
            const productToUpdate = await this.getProductsById(id)
            await this.deleteProduct(id)
            const products = await this.getProducts()

            productToUpdate.title = updatedProduct.title
            productToUpdate.description = updatedProduct.description
            productToUpdate.price = updatedProduct.price
            productToUpdate.thumbnail = updatedProduct.thumbnail
            productToUpdate.code = updatedProduct.code
            productToUpdate.stock = updatedProduct.stock
            
            
            products.push(productToUpdate);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            

            console.log("Producto actualizado:")
            console.log(productToUpdate)
        } catch (error) {
            console.log(error)
        }

    }
    addProduct = async (productAdd) => {
        try {
            const products = await this.getProducts()
            if (products.some(p => p.code === productAdd.code)){
                console.log("Ya existe un producto con este codigo")
            }else if (!productAdd.title || !productAdd.description || !productAdd.price || !productAdd.thumbnail || !productAdd.code || !productAdd.stock){
                console.log("Ninguino de los campos puede estar vacio")
            }else{
                productAdd.id = products.length + 1; 
                products.push(productAdd);
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
                return productAdd
            }
        } catch (error) {
            console.log(error)
            
        }

        
    }
} 




