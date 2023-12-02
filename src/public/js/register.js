const form = document.getElementById('registerForm');

form.addEventListener('submit', async e => {
    e.preventDefault();
    
    const obj = {
        first_name:registerForm[0].value,
        last_name:registerForm[1].value,
        email: registerForm[2].value,
        age:registerForm[3].value,
        password: registerForm[4].value
    }
   
    const respuesta = await fetch('/api/sessions/register', {
        method: 'POST',
        headers: {
            "Accept" : "application/json",
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(obj)
    });
   

    if (respuesta.status === 201) {
        location.href = "/login"
    }else{
        location.href = "/register"
    }
    

})