// Manejador específico para Categories
class CategoryManager {
    constructor() {
        this.containerId = 'categories-results';
    }

    // Obtener todas las categorías
    async getAllCategories() {
        try {
            const size = UI.getNumericValue('categories-size', CONFIG.DEFAULT_SIZES.CATEGORIES);
            const categories = await apiService.getAllCategories(size);

            UI.renderCategories(categories, this.containerId);
            console.log('Categories loaded:', categories);

        } catch (error) {
            console.error('Error loading categories:', error);
            UI.showError(error.message, this.containerId);
        }
    }

    // Obtener categoría por ID
    async getCategoryById() {
        try {
            const id = UI.getNumericValue('category-id');

            if (!id) {
                UI.showError('Por favor ingresa un ID de categoría válido', this.containerId);
                return;
            }

            const category = await apiService.getCategoryById(id);
            UI.renderCategories(category, this.containerId);
            console.log('Category loaded:', category);

        } catch (error) {
            console.error('Error loading category:', error);
            UI.showError(error.message, this.containerId);
        }
    }

    // Limpiar resultados
    clearResults() {
        UI.clearResults(this.containerId);
    }

    // Validar datos de categoría
    validateCategoryData(categoryData) {
        const requiredFields = ['id', 'categoryName', 'description', 'active'];
        return requiredFields.every(field => categoryData && categoryData[field] !== undefined);
    }

    // Formatear datos de categoría para mostrar
    formatCategoryData(category) {
        return {
            ...category,
            categoryName: category.categoryName || 'Sin nombre',
            description: category.description || 'Sin descripción',
            statusText: category.active ? 'Activa' : 'Inactiva',
            statusClass: category.active ? 'status-active' : 'status-inactive'
        };
    }

    // Obtener categorías activas únicamente
    async getActiveCategories() {
        try {
            const size = UI.getNumericValue('categories-size', CONFIG.DEFAULT_SIZES.CATEGORIES);
            const categories = await apiService.getAllCategories(size);

            // Filtrar solo categorías activas
            const activeCategories = categories.filter(cat => cat.active);

            if (activeCategories.length === 0) {
                UI.showError('No se encontraron categorías activas', this.containerId);
                return;
            }

            UI.renderCategories(activeCategories, this.containerId);
            console.log('Active categories loaded:', activeCategories);

        } catch (error) {
            console.error('Error loading active categories:', error);
            UI.showError(error.message, this.containerId);
        }
    }
}

// Instancia global del manejador de categorías
const categoryManager = new CategoryManager();
