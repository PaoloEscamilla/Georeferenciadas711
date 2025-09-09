// Manejador específico para Brands
class BrandManager {
    constructor() {
        this.containerId = 'brands-results';
    }

    // Obtener todas las marcas
    async getAllBrands() {
        try {
            const size = UI.getNumericValue('brands-size', CONFIG.DEFAULT_SIZES.BRANDS);
            const brands = await apiService.getAllBrands(size);

            UI.renderBrands(brands, this.containerId);
            console.log('Brands loaded:', brands);

        } catch (error) {
            console.error('Error loading brands:', error);
            UI.showError(error.message, this.containerId);
        }
    }

    // Obtener marca por ID
    async getBrandById() {
        try {
            const id = UI.getNumericValue('brand-id');

            if (!id) {
                UI.showError('Por favor ingresa un ID de marca válido', this.containerId);
                return;
            }

            const brand = await apiService.getBrandById(id);
            UI.renderBrands(brand, this.containerId);
            console.log('Brand loaded:', brand);

        } catch (error) {
            console.error('Error loading brand:', error);
            UI.showError(error.message, this.containerId);
        }
    }

    // Limpiar resultados
    clearResults() {
        UI.clearResults(this.containerId);
    }

    // Validar datos de marca
    validateBrandData(brandData) {
        const requiredFields = ['id', 'brandName', 'description', 'active'];
        return requiredFields.every(field => brandData && brandData[field] !== undefined);
    }

    // Formatear datos de marca para mostrar
    formatBrandData(brand) {
        return {
            ...brand,
            brandName: brand.brandName || 'Sin nombre',
            description: brand.description || 'Sin descripción',
            statusText: brand.active ? 'Activa' : 'Inactiva',
            statusClass: brand.active ? 'status-active' : 'status-inactive'
        };
    }

    // Obtener marcas activas únicamente
    async getActiveBrands() {
        try {
            const size = UI.getNumericValue('brands-size', CONFIG.DEFAULT_SIZES.BRANDS);
            const brands = await apiService.getAllBrands(size);

            // Filtrar solo marcas activas
            const activeBrands = brands.filter(brand => brand.active);

            if (activeBrands.length === 0) {
                UI.showError('No se encontraron marcas activas', this.containerId);
                return;
            }

            UI.renderBrands(activeBrands, this.containerId);
            console.log('Active brands loaded:', activeBrands);

        } catch (error) {
            console.error('Error loading active brands:', error);
            UI.showError(error.message, this.containerId);
        }
    }

    // Buscar marcas por nombre (simulado con filtrado)
    async searchBrandsByName(searchTerm) {
        try {
            if (!searchTerm || searchTerm.length < 2) {
                UI.showError('Por favor ingresa al menos 2 caracteres para buscar', this.containerId);
                return;
            }

            const brands = await apiService.getAllBrands(50); // Obtener más marcas para buscar

            // Filtrar marcas que contengan el término de búsqueda
            const filteredBrands = brands.filter(brand =>
                brand.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                brand.description.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (filteredBrands.length === 0) {
                UI.showError(`No se encontraron marcas que contengan "${searchTerm}"`, this.containerId);
                return;
            }

            UI.renderBrands(filteredBrands, this.containerId);
            console.log('Filtered brands:', filteredBrands);

        } catch (error) {
            console.error('Error searching brands:', error);
            UI.showError(error.message, this.containerId);
        }
    }
}

// Instancia global del manejador de marcas
const brandManager = new BrandManager();
