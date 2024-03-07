const socket = io();


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
