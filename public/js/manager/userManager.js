// Manejador específico para Users
class UserManager {
    constructor() {
        this.containerId = 'users-results';
    }

    // Obtener todos los usuarios
    async getAllUsers() {
        try {
            const size = UI.getNumericValue('users-size', CONFIG.DEFAULT_SIZES.USERS);
            const users = await apiService.getAllUsers(size);

            UI.renderUsers(users, this.containerId);
            console.log('Users loaded:', users);

        } catch (error) {
            console.error('Error loading users:', error);
            UI.showError(error.message, this.containerId);
        }
    }

    // Obtener usuario por ID
    async getUserById() {
        try {
            const id = UI.getNumericValue('user-id');

            if (!id) {
                UI.showError('Por favor ingresa un ID de usuario válido', this.containerId);
                return;
            }

            const user = await apiService.getUserById(id);
            UI.renderUsers(user, this.containerId);
            console.log('User loaded:', user);

        } catch (error) {
            console.error('Error loading user:', error);
            UI.showError(error.message, this.containerId);
        }
    }

    // Limpiar resultados
    clearResults() {
        UI.clearResults(this.containerId);
    }

    // Validar datos de usuario
    validateUserData(userData) {
        const requiredFields = ['id', 'name', 'username', 'password'];
        return requiredFields.every(field => userData && userData[field] !== undefined);
    }

    // Formatear datos de usuario para mostrar
    formatUserData(user) {
        return {
            ...user,
            name: user.name || 'Sin nombre',
            username: user.username || 'Sin usuario',
            displayPassword: '••••••••' // Ocultar password real
        };
    }
}

// Instancia global del manejador de usuarios
const userManager = new UserManager();
