// Clase para manejar toda la interfaz de usuario
class UIManager {
    constructor() {
        this.loadingSpinner = document.getElementById('loading-spinner');
        this.currentTab = 'users';
    }

    // Mostrar spinner de carga
    showLoading() {
        if (this.loadingSpinner) {
            this.loadingSpinner.classList.add('show');
        }
    }

    // Ocultar spinner de carga
    hideLoading() {
        if (this.loadingSpinner) {
            this.loadingSpinner.classList.remove('show');
        }
    }

    // Cambiar entre pestañas
    switchTab(tabName) {
        // Ocultar todas las secciones
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Desactivar todos los botones de pestaña
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
        });

        // Mostrar la sección seleccionada
        const targetSection = document.getElementById(tabName);
        const targetButton = document.querySelector(`[data-tab="${tabName}"]`);

        if (targetSection && targetButton) {
            targetSection.classList.add('active');
            targetButton.classList.add('active');
            this.currentTab = tabName;
        }
    }

    // Mostrar mensaje de error
    showError(message, containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <strong>⚠️ Error:</strong> ${message}
                </div>
            `;
        }
    }

    // Mostrar mensaje de éxito
    showSuccess(message, containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="success-message">
                    <strong>✅ Éxito:</strong> ${message}
                </div>
            `;
        }
    }

    // Limpiar resultados
    clearResults(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>Haz clic en algún botón para cargar datos</p>
                </div>
            `;
        }
    }

    // Renderizar lista de usuarios
    renderUsers(users, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (!users || users.length === 0) {
            this.showError('No se encontraron usuarios', containerId);
            return;
        }

        const userList = Array.isArray(users) ? users : [users];

        const html = `
            <div class="card-grid">
                ${userList.map(user => `
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">👤 ${user.name}</h3>
                            <span class="card-id">ID: ${user.id}</span>
                        </div>
                        <div class="card-content">
                            <div class="card-field">
                                <span class="card-field-label">Usuario:</span>
                                <span class="card-field-value">@${user.username}</span>
                            </div>
                            <div class="card-field">
                                <span class="card-field-label">Password:</span>
                                <span class="card-field-value">••••••••</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        container.innerHTML = html;
    }

    // Renderizar lista de categorías
    renderCategories(categories, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (!categories || categories.length === 0) {
            this.showError('No se encontraron categorías', containerId);
            return;
        }

        const categoryList = Array.isArray(categories) ? categories : [categories];

        const html = `
            <div class="card-grid">
                ${categoryList.map(category => `
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">📂 ${category.categoryName}</h3>
                            <span class="card-id">ID: ${category.id}</span>
                        </div>
                        <div class="card-content">
                            <div class="card-field">
                                <span class="card-field-label">Descripción:</span>
                                <span class="card-field-value">${category.description}</span>
                            </div>
                            <div class="card-field">
                                <span class="card-field-label">Estado:</span>
                                <span class="status-badge ${category.active ? 'status-active' : 'status-inactive'}">
                                    ${category.active ? 'Activa' : 'Inactiva'}
                                </span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        container.innerHTML = html;
    }

    // Renderizar lista de marcas
    renderBrands(brands, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (!brands || brands.length === 0) {
            this.showError('No se encontraron marcas', containerId);
            return;
        }

        const brandList = Array.isArray(brands) ? brands : [brands];

        const html = `
            <div class="card-grid">
                ${brandList.map(brand => `
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">🏷️ ${brand.brandName}</h3>
                            <span class="card-id">ID: ${brand.id}</span>
                        </div>
                        <div class="card-content">
                            <div class="card-field">
                                <span class="card-field-label">Descripción:</span>
                                <span class="card-field-value">${brand.description}</span>
                            </div>
                            <div class="card-field">
                                <span class="card-field-label">Estado:</span>
                                <span class="status-badge ${brand.active ? 'status-active' : 'status-inactive'}">
                                    ${brand.active ? 'Activa' : 'Inactiva'}
                                </span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        container.innerHTML = html;
    }

    // Renderizar lista de productos
    renderProducts(products, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (!products || products.length === 0) {
            this.showError('No se encontraron productos', containerId);
            return;
        }

        let productList;

        // Manejar respuesta de productos por categoría/marca
        if (products.products && Array.isArray(products.products)) {
            productList = products.products;
        } else {
            productList = Array.isArray(products) ? products : [products];
        }

        const html = `
            <div class="card-grid">
                ${productList.map(product => `
                    <div class="card product-card">
                        <div class="card-image" style="background-image: url('${product.image}');">
                            ${product.image ? '' : '🖼️ Sin imagen'}
                        </div>
                        <div class="card-header">
                            <h3 class="card-title">🛍️ ${product.productName}</h3>
                            <span class="card-id">ID: ${product.id}</span>
                        </div>
                        <div class="card-content">
                            <div class="product-price">${product.price}</div>
                            <div class="card-field">
                                <span class="card-field-label">Descripción:</span>
                                <span class="card-field-value">${product.description}</span>
                            </div>
                            <div class="card-field">
                                <span class="card-field-label">Stock:</span>
                                <span class="product-stock ${this.getStockClass(product.stock)}">
                                    ${product.stock} unidades
                                </span>
                            </div>
                            <div class="card-field">
                                <span class="card-field-label">Categoría ID:</span>
                                <span class="card-field-value">${product.categoryId}</span>
                            </div>
                            <div class="card-field">
                                <span class="card-field-label">Marca ID:</span>
                                <span class="card-field-value">${product.brandId}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        container.innerHTML = html;
    }

    // Obtener clase CSS según el stock
    getStockClass(stock) {
        if (stock > 50) return 'stock-high';
        if (stock > 20) return 'stock-medium';
        return 'stock-low';
    }

    // Obtener valor de input
    getInputValue(inputId) {
        const input = document.getElementById(inputId);
        return input ? input.value.trim() : '';
    }

    // Obtener valor numérico de input
    getNumericValue(inputId, defaultValue = null) {
        const value = this.getInputValue(inputId);
        const numValue = parseInt(value);
        return isNaN(numValue) ? defaultValue : numValue;
    }

    // Animar entrada de elementos
    animateElements(elements, delay = CONFIG.UI.ANIMATION_DELAY) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                element.style.transition = `all ${CONFIG.UI.FADE_DURATION}ms ease`;

                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 50);
            }, index * delay);
        });
    }
}

// Instancia global del manejador de UI
const UI = new UIManager();
