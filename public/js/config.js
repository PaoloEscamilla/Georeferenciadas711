// Configuración global de la aplicación
const CONFIG = {
    API_BASE_URL: 'http://localhost:3000/api/v1',

    ENDPOINTS: {
        USERS: '/users',
        CATEGORIES: '/categories',
        BRANDS: '/brands',
        PRODUCTS: '/products'
    },

    DEFAULT_SIZES: {
        USERS: 10,
        CATEGORIES: 10,
        BRANDS: 10,
        PRODUCTS: 10
    },

    MAX_RETRIES: 3,
    REQUEST_TIMEOUT: 5000,

    MESSAGES: {
        LOADING: 'Cargando datos...',
        ERROR_NETWORK: 'Error de conexión. Verifica que el servidor esté ejecutándose.',
        ERROR_NOT_FOUND: 'No se encontraron datos.',
        ERROR_INVALID_ID: 'Por favor ingresa un ID válido.',
        SUCCESS_LOAD: 'Datos cargados exitosamente.'
    },

    UI: {
        FADE_DURATION: 300,
        ANIMATION_DELAY: 100
    }
};
