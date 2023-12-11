import { getCartproduct, getAllproducts } from "../services/views.services.js"

const getcart = async  (req, res)=>{
    try {
        const cid = req.user.cart.id
        const cart = await getCartproduct(cid)
        res.render("cart",{
            cart,
            user:req.user
        })
    } catch (error) {
        console.error(error.message)
    }
}

const getproducts = async  (req, res)=>{
    try {
        const cid = req.user.cart.id
        const {page = 1} = req.query
        const {docs, hasPrevPage, hasNextPage, nextPage, prevPage} = await getAllproducts(page)
        res.render("home",{
            user: req.user,
            products: docs,hasPrevPage,hasNextPage,nextPage,prevPage,cid
            
            
        })
    } catch (error) {
        console.error(error.message)
    }
}

export{
    getcart,
    getproducts
}