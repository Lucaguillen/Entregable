const socket = io();

//products


const addToCart = (_id) =>{
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