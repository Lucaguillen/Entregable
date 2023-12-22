import fs from "fs";
import { __dirname } from "../../utils.js";
import { v4 as uuidv4 } from "uuid";
 
export default class usersManager {
    constructor() {
        this.path = `${__dirname}/dao/fileManagers/files/users.json`;
    }

    create = async (newUser) => {
        const data = await fs.promises.readFile(this.path, 'utf-8');
        const users = JSON.parse(data);
    
        
        newUser._id = uuidv4();
        
    
        
        users.push(newUser);
    
        
        await fs.promises.writeFile(this.path, JSON.stringify(users, null, 2), 'utf-8');
        
        return newUser;
    };
    setCartToUser = async (cid, uid) => {
        const data = await fs.promises.readFile(this.path, 'utf-8');
        const users = JSON.parse(data);

        const userIndex = users.findIndex(u => u._id === uid);

        if (userIndex !== -1) {
            // Asegurarse de que 'cart' existe y es un objeto
            users[userIndex].cart = users[userIndex].cart || {};
            
            // Establecer 'id' solo si 'cart' es un objeto
            if (typeof users[userIndex].cart === 'object') {
                users[userIndex].cart.id = cid;
                await fs.promises.writeFile(this.path, JSON.stringify(users, null, 2), 'utf-8');
                return users[userIndex];
            } else {
                console.error('La propiedad "cart" no es un objeto válido en el usuario.');
            }
        } else {
            console.error('Usuario no encontrado.');
        }
    };
    
    findByEmail = async (emailToSend) => {
        const data = await fs.promises.readFile(this.path, 'utf-8');
        const users = JSON.parse(data);

        const user = users.find(u => u.email === emailToSend);

        if (user) {
            // Inicializar 'cart' como un objeto vacío si aún no existe
            user.cart = user.cart || {};

            if (user.cart.id) {
                const cartData = await fs.promises.readFile(`${__dirname}/dao/fileManagers/files/carritos.json`, 'utf-8');
                const carts = JSON.parse(cartData);
                const cart = carts.find(c => c._id === user.cart.id);

                // Asignar 'cart' solo si se encuentra el carrito asociado
                if (cart) {
                    user.cart = cart;
                } else {
                    console.error('No se encontró el carrito asociado al usuario.');
                }
            }

            return user;
        }

        return null;
    }

}; 