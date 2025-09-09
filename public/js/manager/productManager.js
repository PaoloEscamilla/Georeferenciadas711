// Manejador específico para Products
class ProductManager {
    constructor() {
        this.containerId = 'products-results';
    }

    // Obtener todos los productos
    async getAllProducts() {
        try {
            const size = UI.getNumericValue('products-size', CONFIG.DEFAULT_SIZES.PRODUCTS);
            const products = await apiService.getAllProducts(size);

            UI.renderProducts(products, this.containerId);
            console.log('Products loaded:', products);

        } catch (error) {
            console.error('Error loading products:', error);
            UI.showError(error.message, this.containerId);
        }
    }

    // Obtener producto por ID
    async getProductById() {
        try {
            const id = UI.getNumericValue('product-id');

            if (!id) {
                UI.showError('Por favor ingresa un ID de producto válido', this.containerId);
                return;
            }

            const product = await apiService.getProductById(id);
            UI.renderProducts(product, this.containerId);
            console.log('Product loaded:', product);

        } catch (error) {
            console.error('Error loading product:', error);
            UI.showError(error.message, this.containerId);
        }
    }

    // Obtener productos por categoría
    async getProductsByCategory() {
        try {
            const categoryId = UI.getNumericValue('product-category');
            const size = UI.getNumericValue('products-size', 5);

            if (!categoryId) {
                UI.showError('Por favor ingresa un ID de categoría válido', this.containerId);
                return;
            }

            const response = await apiService.getProductsByCategory(categoryId, size);

            // Mostrar información adicional sobre la categoría
            const container = document.getElementById(this.containerId);
            if (container && response.categoryId) {
                const categoryInfo = `
                    <div class="success-message">
                        <strong>📂 Productos de la categoría ID: ${response.categoryId}</strong>
                        <br>Se encontraron ${response.products ? response.products.length : 0} productos
                    </div>
                `;
                container.innerHTML = categoryInfo;

                // Agregar productos después del mensaje
                setTimeout(() => {
                    UI.renderProducts(response, this.containerId);
                }, 500);
            } else {
                UI.renderProducts(response, this.containerId);
            }

            console.log('Products by category loaded:', response);

        } catch (error) {
            console.error('Error loading products by category:', error);
            UI.showError(error.message, this.containerId);
        }
    }

    // Obtener productos por marca
    async getProductsByBrand() {
        try {
            const brandId = UI.getNumericValue('product-brand');
            const size = UI.getNumericValue('products-size', 5);

            if (!brandId) {
                UI.showError('Por favor ingresa un ID de marca válido', this.containerId);
                return;
            }

            const response = await apiService.getProductsByBrand(brandId, size);

            // Mostrar información adicional sobre la marca
            const container = document.getElementById(this.containerId);
            if (container && response.brandId) {
                const brandInfo = `
                    <div class="success-message">
                        <strong>🏷️ Productos de la marca ID: ${response.brandId}</strong>
                        <br>Se encontraron ${response.products ? response.products.length : 0} productos
                    </div>
                `;
                container.innerHTML = brandInfo;

                // Agregar productos después del mensaje
                setTimeout(() => {
                    UI.renderProducts(response, this.containerId);
                }, 500);
            } else {
                UI.renderProducts(response, this.containerId);
            }

            console.log('Products by brand loaded:', response);

        } catch (error) {
            console.error('Error loading products by brand:', error);
            UI.showError(error.message, this.containerId);
        }
    }

    // Limpiar resultados
    clearResults() {
        UI.clearResults(this.containerId);
    }

    // Validar datos de producto
    validateProductData(productData) {
        const requiredFields = ['id', 'productName', 'price', 'stock', 'categoryId', 'brandId'];
        return requiredFields.every(field => productData && productData[field] !== undefined);
    }

    // Formatear datos de producto para mostrar
    formatProductData(product) {
        return {
            ...product,
            productName: product.productName || 'Sin nombre',
            description: product.description || 'Sin descripción',
            price: typeof product.price === 'number' ? product.price.toFixed(2) : '0.00',
            stock: product.stock || 0,
            stockClass: this.getStockClass(product.stock || 0),
            stockText: `${product.stock || 0} unidades`,
            categoryId: product.categoryId || 'N/A',
            brandId: product.brandId || 'N/A'
        };
    }

    // Obtener clase CSS según el stock
    getStockClass(stock) {
        if (stock > 50) return 'stock-high';
        if (stock > 20) return 'stock-medium';
        return 'stock-low';
    }

    // Obtener productos con stock bajo
    async getLowStockProducts() {
        try {
            const products = await apiService.getAllProducts(50); // Obtener más productos

            // Filtrar productos con stock bajo (menos de 20)
            const lowStockProducts = products.filter(product => product.stock < 20);

            if (lowStockProducts.length === 0) {
                UI.showError('No se encontraron productos con stock bajo', this.containerId);
                return;
            }

            // Mostrar mensaje informativo
            const container = document.getElementById(this.containerId);
            if (container) {
                const infoMessage = `
                    <div class="error-message">
                        <strong>⚠️ Productos con Stock Bajo</strong>
                        <br>Se encontraron ${lowStockProducts.length} productos con menos de 20 unidades
                    </div>
                `;
                container.innerHTML = infoMessage;

                setTimeout(() => {
                    UI.renderProducts(lowStockProducts, this.containerId);
                }, 500);
            }

            console.log('Low stock products:', lowStockProducts);

        } catch (error) {
            console.error('Error loading low stock products:', error);
            UI.showError(error.message, this.containerId);
        }
    }

    // Obtener productos ordenados por precio
    async getProductsSortedByPrice(ascending = true) {
        try {
            const size = UI.getNumericValue('products-size', CONFIG.DEFAULT_SIZES.PRODUCTS);
            const products = await apiService.getAllProducts(size);

            // Ordenar productos por precio
            const sortedProducts = [...products].sort((a, b) => {
                return ascending ? a.price - b.price : b.price - a.price;
            });

            // Mostrar mensaje informativo
            const container = document.getElementById(this.containerId);
            if (container) {
                const sortMessage = `
                    <div class="success-message">
                        <strong>💰 Productos ordenados por precio ${ascending ? '(menor a mayor)' : '(mayor a menor)'}</strong>
                    </div>
                `;
                container.innerHTML = sortMessage;

                setTimeout(() => {
                    UI.renderProducts(sortedProducts, this.containerId);
                }, 500);
            }

            console.log('Sorted products:', sortedProducts);

        } catch (error) {
            console.error('Error loading sorted products:', error);
            UI.showError(error.message, this.containerId);
        }
    }
}

// Instancia global del manejador de productos
const productManager = new ProductManager();
