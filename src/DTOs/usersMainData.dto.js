export default class UsersMainDataDTO {
    constructor (users) {
        // Si users es un array, mapeamos cada usuario a un DTO y devolvemos un array de DTOs
        if (Array.isArray(users)) {
            this.data = users.map(user => ({
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                role: user.role
            }));
        } else { // Si users no es un array, suponemos que es un único usuario
            this.data = {
                name: `${users.first_name} ${users.last_name}`,
                email: users.email,
                role: users.role
            };
        }
    }
}
