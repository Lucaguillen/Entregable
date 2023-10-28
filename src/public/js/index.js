const socket = io();
const addproductform = document.getElementById("addproductform");

// chat
let user
const inputChat = document.getElementById("inputChat")
const messagesLogs = document.getElementById("messageLogs")

Swal.fire({
    title: "Bienvenido!",
    input: "text",
    text: "Ingresa tu nombre de usuario",
    inputValidator: (value) =>{
        return !value && "Este campo no puede estar vacio"
    },
    allowOutsideClick: false,
    allowEscapeKey: false

}).then(result =>{
    user = result.value
    socket.emit("autenticado", user)
})

inputChat.addEventListener("keyup", e =>{
    if(e.key=== "Enter"){
        if(inputChat.value.trim().length > 0){
            socket.emit("message",{user, text: inputChat.value})
            inputChat.value = ""
        }
    }
})

socket.on("messageLogs", data => {
    console.log(data)
    let messages = ""
    data.forEach( message =>{
        messages += `${message.user} dice: ${message.text}<br/>`
    })
    messagesLogs.innerHTML=messages
})

//PRODUCTOS



addproductform.addEventListener("submit", (event) => {
  event.preventDefault(); 

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const code = document.getElementById("code").value;
  const stock = document.getElementById("stock").value;
  const price = document.getElementById("price").value;
  const status = document.getElementById("status").value;
  const category = document.getElementById("category").value;

  const newProduct = {
    title,
    description,
    code,
    stock,
    price,
    status,
    category,
    };

    socket.emit("agregarProducto", newProduct);
    
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("code").value = "";
    document.getElementById("stock").value = "";
    document.getElementById("price").value = "";
    document.getElementById("status").value = "";
    document.getElementById("category").value = "";
});

const deleteproductsform = document.getElementById("deleteproductform");
const piddelete = document.getElementById("pid");

deleteproductsform.addEventListener('submit', (e) => {
    e.preventDefault();

    const pid = piddelete.value;
    socket.emit('deleteproduct', pid);

    piddelete.value = '';
});

// mostrar todos los productos

const pcontainer = document.getElementById('pcontainer')

socket.on('showproducts', data => {
    console.log(data)
    pcontainer.innerHTML= ""
    data.forEach(prod => {
        pcontainer.innerHTML += `
            <ul>
                <li>title: ${prod.title}</li> 
                <li>description: ${prod.description}</li>
                <li>code: ${prod.code}</li>
                <li>price: ${prod.price}</li>
                <li>status: ${prod.status}</li>
                <li>stock: ${prod.stock}</li>
                <li>category: ${prod.category}</li>
                <li>id: ${prod.pid}</li>
            </ul>
        `
    })
})