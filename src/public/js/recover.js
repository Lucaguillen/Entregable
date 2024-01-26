const formPassForm = document.getElementById('passForm');

formPassForm.addEventListener('submit', async e => {
    e.preventDefault();

    const email = formPassForm.querySelector('input[name="email"]').value;

    const respuesta = await fetch('/api/sessions/recoverPass', {
        method: 'POST', 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    });
});



