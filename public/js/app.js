// Archivo principal de la aplicación
class App {
    constructor() {
        this.init();
    }

    // Inicializar la aplicación
    init() {
        this.setupEventListeners();
        this.loadInitialData();
        console.log('🚀 App initialized successfully');
    }

    // Configurar event listeners
    setupEventListeners() {
        // Event listeners para las pestañas
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                UI.switchTab(tabName);
            });
        });

        // Event listeners para teclas Enter en inputs
        this.setupEnterKeyListeners();

        // Event listener para errores globales
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
        });

        // Event listener para errores de promesas no capturadas
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
        });

        console.log('✅ Event listeners configured');
    }

    // Configurar listeners para tecla Enter en inputs
    setupEnterKeyListeners() {
        // Users
        document.getElementById('users-size')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') userManager.getAllUsers();
        });

        document.getElementById('user-id')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') userManager.getUserById();
        });

        // Categories
        document.getElementById('categories-size')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') categoryManager.getAllCategories();
        });

        document.getElementById('category-id')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') categoryManager.getCategoryById();
        });

        // Brands
        document.getElementById('brands-size')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') brandManager.getAllBrands();
        });

        document.getElementById('brand-id')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') brandManager.getBrandById();
        });

        // Products
        document.getElementById('products-size')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') productManager.getAllProducts();
        });

        document.getElementById('product-id')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') productManager.getProductById();
        });

        document.getElementById('product-category')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') productManager.getProductsByCategory();
        });

        document.getElementById('product-brand')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') productManager.getProductsByBrand();
        });
    }

    // Cargar datos iniciales
    async loadInitialData() {
        try {
            // Mostrar mensaje de bienvenida
            console.log('🎉 Bienvenido al E-commerce API Consumer');
            console.log('📊 Puedes comenzar cargando algunos usuarios de ejemplo');

            // Opcional: cargar algunos datos por defecto
            // await this.loadDefaultData();

        } catch (error) {
            console.error('Error loading initial data:', error);
        }
    }

    // Cargar datos por defecto (opcional)
    async loadDefaultData() {
        try {
            // Cargar algunos usuarios por defecto
            await userManager.getAllUsers();

        } catch (error) {
            console.warn('Could not load default data:', error);
        }
    }

    // Método para testing de la API
    async testAPI() {
        console.log('🧪 Testing API endpoints...');

        try {
            // Test Users
            console.log('Testing Users...');
            const users = await apiService.getAllUsers(3);
            console.log('✅ Users test passed:', users);

            // Test Categories
            console.log('Testing Categories...');
            const categories = await apiService.getAllCategories(3);
            console.log('✅ Categories test passed:', categories);

            // Test Brands
            console.log('Testing Brands...');
            const brands = await apiService.getAllBrands(3);
            console.log('✅ Brands test passed:', brands);

            // Test Products
            console.log('Testing Products...');
            const products = await apiService.getAllProducts(3);
            console.log('✅ Products test passed:', products);

            // Test Products by Category
            console.log('Testing Products by Category...');
            const productsByCategory = await apiService.getProductsByCategory(1, 2);
            console.log('✅ Products by Category test passed:', productsByCategory);

            // Test Products by Brand
            console.log('Testing Products by Brand...');
            const productsByBrand = await apiService.getProductsByBrand(1, 2);
            console.log('✅ Products by Brand test passed:', productsByBrand);

            console.log('🎉 All API tests passed!');

        } catch (error) {
            console.error('❌ API test failed:', error);
        }
    }

    // Método para limpiar todos los resultados
    clearAllResults() {
        userManager.clearResults();
        categoryManager.clearResults();
        brandManager.clearResults();
        productManager.clearResults();
        console.log('🧹 All results cleared');
    }

    // Método para mostrar estadísticas de uso
    showUsageStats() {
        const stats = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            averageResponseTime: 0
        };

        console.log('📈 Usage Statistics:', stats);
        return stats;
    }

    // Método para exportar datos (futuro)
    exportData(format = 'json') {
        console.log(`📤 Export data in ${format} format`);
        // Implementar funcionalidad de exportación
    }

    // Método para importar configuración
    importConfig(config) {
        console.log('📥 Importing configuration:', config);
        // Implementar funcionalidad de importación
    }

    // Método para toggle de modo oscuro (futuro)
    toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
        console.log(`🌙 Dark mode ${isDark ? 'enabled' : 'disabled'}`);
    }

    // Método para configurar notificaciones
    setupNotifications() {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }

    // Mostrar notificación
    showNotification(title, message, type = 'info') {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/favicon.ico'
            });
        }

        console.log(`🔔 ${type.toUpperCase()}: ${title} - ${message}`);
    }

    // Método para debugging
    debug() {
        console.log('🐛 Debug Info:');
        console.log('- Current tab:', UI.currentTab);
        console.log('- API Base URL:', CONFIG.API_BASE_URL);
        console.log('- App instance:', this);
        console.log('- Managers:', {
            userManager,
            categoryManager,
            brandManager,
            productManager
        });
    }
}

// Funciones globales para acceso desde consola
window.appDebug = () => app.debug();
window.testAPI = () => app.testAPI();
window.clearAll = () => app.clearAllResults();

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();

    // Hacer disponibles las instancias globalmente para debugging
    window.UI = UI;
    window.apiService = apiService;
    window.userManager = userManager;
    window.categoryManager = categoryManager;
    window.brandManager = brandManager;
    window.productManager = productManager;

    console.log('🎯 App ready! Try these commands in console:');
    console.log('- appDebug() - Show debug information');
    console.log('- testAPI() - Test all API endpoints');
    console.log('- clearAll() - Clear all results');
});
