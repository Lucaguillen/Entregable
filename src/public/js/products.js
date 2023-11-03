const socket = io();

//products

const addToCart = (_id) =>{
    const cid = "6544e501bef87d7997ccea14"; 
    const pid = _id; 

    fetch(`/api/carts/${cid}/product/${pid}`, {
        method: 'POST',
    })
    .then(response => {
        if (response.ok) {
            
            console.log(`Producto con ID ${pid} agregado al carrito con ID ${cid}.`);
        } else {
            
            console.error('Error al agregar el producto al carrito.');
        }
    })
    .catch(error => {
        console.error('Error de red al agregar el producto al carrito:', error);
    });

}
