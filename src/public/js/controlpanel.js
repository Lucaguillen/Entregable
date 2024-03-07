const socket = io();

const deleteUser = (_id) =>{
    const uid = _id; 
    fetch(`/api/sessions/${uid}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            
            console.log(`El usuario con ID ${uid} fue eliminado.`);
        } else {
            
            console.error('Error al eliminar el usuario.');
        }
    })
    .catch(error => {
        console.error('Error de red al eliminar el usuario:', error);
    });
   
}

const switchRol = (_id) =>{
    const uid = _id; 
    console.log(uid)
    fetch(`/api/sessions/premium/${uid}`, {
        method: 'PUT',
    })
    .then(response => {
        if (response.ok) {
            
            console.log(`El rol del usuario con ID ${uid} fue cambiado.`);
        } else {
            
            console.error('Error al cambiar el rol del usuario.');
        }
    })
    .catch(error => {
        console.error('Error de red al modificar el rol del usuario:', error);
    });
   
}
