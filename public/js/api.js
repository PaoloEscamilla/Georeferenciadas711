// Clase para manejar todas las peticiones a la API
class ApiService {
    constructor() {
        this.baseURL = CONFIG.API_BASE_URL;
        this.timeout = CONFIG.REQUEST_TIMEOUT;
    }

    // Método genérico para hacer peticiones HTTP
    async makeRequest(url, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            UI.showLoading();

            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new Error('La petición tardó demasiado tiempo');
            }

            if (error.message.includes('fetch')) {
                throw new Error(CONFIG.MESSAGES.ERROR_NETWORK);
            }

            throw error;
        } finally {
            UI.hideLoading();
        }
    }

    // USERS API calls
    async getAllUsers(size = CONFIG.DEFAULT_SIZES.USERS) {
        const url = `${this.baseURL}${CONFIG.ENDPOINTS.USERS}?size=${size}`;
        return await this.makeRequest(url);
    }

    async getUserById(id) {
        if (!id || id < 1) {
            throw new Error(CONFIG.MESSAGES.ERROR_INVALID_ID);
        }
        const url = `${this.baseURL}${CONFIG.ENDPOINTS.USERS}/${id}`;
        return await this.makeRequest(url);
    }

    // CATEGORIES API calls
    async getAllCategories(size = CONFIG.DEFAULT_SIZES.CATEGORIES) {
        const url = `${this.baseURL}${CONFIG.ENDPOINTS.CATEGORIES}?size=${size}`;
        return await this.makeRequest(url);
    }

    async getCategoryById(id) {
        if (!id || id < 1) {
            throw new Error(CONFIG.MESSAGES.ERROR_INVALID_ID);
        }
        const url = `${this.baseURL}${CONFIG.ENDPOINTS.CATEGORIES}/${id}`;
        return await this.makeRequest(url);
    }

    // BRANDS API calls
    async getAllBrands(size = CONFIG.DEFAULT_SIZES.BRANDS) {
        const url = `${this.baseURL}${CONFIG.ENDPOINTS.BRANDS}?size=${size}`;
        return await this.makeRequest(url);
    }

    async getBrandById(id) {
        if (!id || id < 1) {
            throw new Error(CONFIG.MESSAGES.ERROR_INVALID_ID);
        }
        const url = `${this.baseURL}${CONFIG.ENDPOINTS.BRANDS}/${id}`;
        return await this.makeRequest(url);
    }

    // PRODUCTS API calls
    async getAllProducts(size = CONFIG.DEFAULT_SIZES.PRODUCTS) {
        const url = `${this.baseURL}${CONFIG.ENDPOINTS.PRODUCTS}?size=${size}`;
        return await this.makeRequest(url);
    }

    async getProductById(id) {
        if (!id || id < 1) {
            throw new Error(CONFIG.MESSAGES.ERROR_INVALID_ID);
        }
        const url = `${this.baseURL}${CONFIG.ENDPOINTS.PRODUCTS}/${id}`;
        return await this.makeRequest(url);
    }

    async getProductsByCategory(categoryId, size = 5) {
        if (!categoryId || categoryId < 1) {
            throw new Error(CONFIG.MESSAGES.ERROR_INVALID_ID);
        }
        const url = `${this.baseURL}${CONFIG.ENDPOINTS.PRODUCTS}/category/${categoryId}?size=${size}`;
        return await this.makeRequest(url);
    }

    async getProductsByBrand(brandId, size = 5) {
        if (!brandId || brandId < 1) {
            throw new Error(CONFIG.MESSAGES.ERROR_INVALID_ID);
        }
        const url = `${this.baseURL}${CONFIG.ENDPOINTS.PRODUCTS}/brand/${brandId}?size=${size}`;
        return await this.makeRequest(url);
    }
}

// Instancia global del servicio API
const apiService = new ApiService();
