const form = document.getElementById('loginForm');


form.addEventListener('submit', async e => {
    e.preventDefault();

    const obj = {
        email: loginForm[0].value,
        password: loginForm[1].value
    }

    const respuesta = await fetch('/api/sessions/login', {
        method: 'POST',
        headers: {
            "Accept" : "application/json",
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(obj)
    });


    if (respuesta.status === 200) {
        location.href = "/products"
    }else{
        location.href = "/login"
    }
})