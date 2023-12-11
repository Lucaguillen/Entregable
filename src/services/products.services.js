import ProductManager from "../dao/memoryManager/products.manager.js";

const productManager = new ProductManager()

const deleteProductService = async (id)=>{
    const result = await productManager.deleteProduct(id)
    return result
}

const getProductsService = async () =>{
    const result = await productManager.getProducts()
    return result
}

const getProductsByIdService = async (id) =>{
    const result = await productManager.getProductsById(id)
    return result
}

const updateProductService = async (productToUpdate,id) =>{
    const result = await productManager.updateProduct(productToUpdate, id )
    return result
}
const addProductService = async (product) =>{
    const result = productManager.addProduct(product)
    return result
}

const getAllPaginateService = async  (limit, page, sort, query, queryvalue) => {
    
    const filter = {
        $or: [
            { category: { $regex: queryvalue || "", $options: "i" } },
            { stock: { $gte: Number(queryvalue) || 0 } } 
        ]
    };

    const options = {
        limit: Number(limit) || 10,
        page: Number(page) || 1,
    };

    if (sort === "1" || sort === "-1") {
        options.sort = { price: Number(sort) };
    }

    const products = await productManager.productPaginate2(filter, options)
    return products
    
}




export{
    deleteProductService,
    getProductsService,
    getProductsByIdService,
    updateProductService,
    addProductService,
    getAllPaginateService
}