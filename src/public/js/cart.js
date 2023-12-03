const socket = io();

//cart


const emptyCart = (_id) =>{
    const cid = _id; 
    fetch(`/api/carts/${cid}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            
            console.log(`Carrito con ID ${cid} vaciado.`);
        } else {
            
            console.error('Error al vaciar el carrito.');
        }
    })
    .catch(error => {
        console.error(error);
    });
   
}
/* const addQuantity = (_id) =>{
    const pid = _id; 
    fetch(`/api/carts/product/${pid}`, {
        method: 'POST',
    })
    .then(response => {
        if (response.ok) {
            
            console.log(`Producto con ID ${pid} agregado al carrito.`);
        } else {
            
            console.error('Error al agregar el producto al carrito.');
        }
    })
    .catch(error => {
        console.error('Error de red al agregar el producto al carrito:', error);
    });
   
}
const removeQuantity = (_id) =>{
    const pid = _id; 
    fetch(`/api/carts/product/${pid}`, {
        method: 'POST',
    })
    .then(response => {
        if (response.ok) {
            
            console.log(`Producto con ID ${pid} agregado al carrito.`);
        } else {
            
            console.error('Error al agregar el producto al carrito.');
        }
    })
    .catch(error => {
        console.error('Error de red al agregar el producto al carrito:', error);
    });
   
} */