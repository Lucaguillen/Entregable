import { getCartproduct, getAllproducts } from "../services/views.services.js"

const loggers = async (req, res) => {
    try {
        req.logger.fatal('prueba fatal');
        req.logger.error('prueba error');
        req.logger.warning('prueba warning');
        req.logger.info('prueba info');
        req.logger.http('prueba http');
        req.logger.debug('prueba debug');
    
        res.send({ result: 'hola' });
    } catch (error) {
        req.logger.fatal(error.message)
        res.sendClientError(error.message)
    }
}

const getcart = async  (req, res)=>{
    try {
        const cid = req.user.cart.id
        const cart = await getCartproduct(cid)
        res.render("cart",{
            cart,
            user:req.user
        })
    } catch (error) {
        req.logger.fatal(error.message)
        res.sendClientError(error.message)
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
        req.logger.fatal(error.message)
        res.sendClientError(error.message)
    }
}

export{
    getcart,
    getproducts,
    loggers
}