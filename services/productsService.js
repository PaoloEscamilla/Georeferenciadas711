const faker = require('faker');
const { getProducts, getCategories, getBrands, getNextProductId } = require('../data/mockData');

class ProductsService {
  constructor() {
    this.products = getProducts();
    this.categories = getCategories();
    this.brands = getBrands();
  }

  // Verificar si existe una categoría
  categoryExists(categoryId) {
    return this.categories.some(cat => cat.id === categoryId);
  }

  // Verificar si existe una marca
  brandExists(brandId) {
    return this.brands.some(brand => brand.id === brandId);
  }

  // Obtener todos los productos con filtros opcionales
  findAll(filters = {}) {
    let productsList = [...this.products];

    // Filtrar por precio mínimo
    if (filters.minPrice) {
      productsList = productsList.filter(p => p.price >= parseFloat(filters.minPrice));
    }

    // Filtrar por precio máximo
    if (filters.maxPrice) {
      productsList = productsList.filter(p => p.price <= parseFloat(filters.maxPrice));
    }

    // Filtrar por stock mínimo
    if (filters.minStock) {
      productsList = productsList.filter(p => p.stock >= parseInt(filters.minStock));
    }

    // Aplicar filtro de tamaño si existe
    if (filters.size) {
      const limit = parseInt(filters.size);
      productsList = productsList.slice(0, limit);
    }

    return {
      data: productsList,
      total: this.products.length
    };
  }

  // Obtener producto por ID
  findOne(id) {
    const productId = parseInt(id);
    const product = this.products.find(p => p.id === productId);

    if (!product) {
      const error = new Error(`Product with id ${productId} does not exist`);
      error.statusCode = 404;
      throw error;
    }

    return product;
  }

  // Obtener productos por categoría
  findByCategory(categoryId, filters = {}) {
    const catId = parseInt(categoryId);

    if (!this.categoryExists(catId)) {
      const error = new Error(`Category with id ${catId} does not exist`);
      error.statusCode = 404;
      throw error;
    }

    const productsByCategory = this.products.filter(p => p.categoryId === catId);

    if (productsByCategory.length === 0) {
      const error = new Error(`No products found for category ${catId}`);
      error.statusCode = 404;
      throw error;
    }

    // Aplicar filtro de tamaño si existe
    if (filters.size) {
      const limit = parseInt(filters.size);
      return {
        categoryId: catId,
        data: productsByCategory.slice(0, limit),
        total: productsByCategory.length
      };
    }

    return {
      categoryId: catId,
      data: productsByCategory,
      total: productsByCategory.length
    };
  }

  // Obtener productos por marca
  findByBrand(brandId, filters = {}) {
    const brId = parseInt(brandId);

    if (!this.brandExists(brId)) {
      const error = new Error(`Brand with id ${brId} does not exist`);
      error.statusCode = 404;
      throw error;
    }

    const productsByBrand = this.products.filter(p => p.brandId === brId);

    if (productsByBrand.length === 0) {
      const error = new Error(`No products found for brand ${brId}`);
      error.statusCode = 404;
      throw error;
    }

    // Aplicar filtro de tamaño si existe
    if (filters.size) {
      const limit = parseInt(filters.size);
      return {
        brandId: brId,
        data: productsByBrand.slice(0, limit),
        total: productsByBrand.length
      };
    }

    return {
      brandId: brId,
      data: productsByBrand,
      total: productsByBrand.length
    };
  }

  // Crear nuevo producto
  create(productData) {
    const { productName, description, price, stock, categoryId, brandId, image } = productData;

    // Validaciones básicas
    if (!productName || price === undefined || categoryId === undefined || brandId === undefined) {
      const error = new Error('Product name, price, categoryId and brandId are required');
      error.statusCode = 400;
      throw error;
    }

    if (price < 0) {
      const error = new Error('Price cannot be negative');
      error.statusCode = 400;
      throw error;
    }

    if (stock !== undefined && stock < 0) {
      const error = new Error('Stock cannot be negative');
      error.statusCode = 400;
      throw error;
    }

    // Validar existencia de categoría
    const catId = parseInt(categoryId);
    if (!this.categoryExists(catId)) {
      const error = new Error(`Cannot create product. Category with id ${catId} does not exist.`);
      error.statusCode = 404;
      throw error;
    }

    // Validar existencia de marca
    const brId = parseInt(brandId);
    if (!this.brandExists(brId)) {
      const error = new Error(`Cannot create product. Brand with id ${brId} does not exist.`);
      error.statusCode = 404;
      throw error;
    }

    const newProduct = {
      id: getNextProductId(),
      productName,
      description: description || faker.lorem.paragraph(),
      price: parseFloat(price),
      stock: stock !== undefined ? parseInt(stock) : faker.datatype.number({ min: 0, max: 100 }),
      categoryId: catId,
      brandId: brId,
      image: image || faker.image.imageUrl(400, 400, 'product'),
      createdAt: new Date()
    };

    this.products.push(newProduct);
    return newProduct;
  }

  // Actualizar producto completo (PUT)
  update(id, productData) {
    const productId = parseInt(id);
    const { productName, description, price, stock, categoryId, brandId, image } = productData;

    const productIndex = this.products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      const error = new Error(`Product with id ${productId} does not exist`);
      error.statusCode = 404;
      throw error;
    }

    // Validaciones básicas
    if (!productName || price === undefined || categoryId === undefined || brandId === undefined) {
      const error = new Error('Product name, price, categoryId and brandId are required');
      error.statusCode = 400;
      throw error;
    }

    if (price < 0) {
      const error = new Error('Price cannot be negative');
      error.statusCode = 400;
      throw error;
    }

    if (stock !== undefined && stock < 0) {
      const error = new Error('Stock cannot be negative');
      error.statusCode = 400;
      throw error;
    }

    // Validar existencia de categoría
    const catId = parseInt(categoryId);
    if (!this.categoryExists(catId)) {
      const error = new Error(`Cannot update product. Category with id ${catId} does not exist.`);
      error.statusCode = 404;
      throw error;
    }

    // Validar existencia de marca
    const brId = parseInt(brandId);
    if (!this.brandExists(brId)) {
      const error = new Error(`Cannot update product. Brand with id ${brId} does not exist.`);
      error.statusCode = 404;
      throw error;
    }

    const updatedProduct = {
      ...this.products[productIndex],
      productName,
      description: description || this.products[productIndex].description,
      price: parseFloat(price),
      stock: stock !== undefined ? parseInt(stock) : this.products[productIndex].stock,
      categoryId: catId,
      brandId: brId,
      image: image || this.products[productIndex].image,
      updatedAt: new Date()
    };

    this.products[productIndex] = updatedProduct;
    return updatedProduct;
  }

  // Actualizar producto parcialmente (PATCH)
  partialUpdate(id, updates) {
    const productId = parseInt(id);

    const productIndex = this.products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      const error = new Error(`Product with id ${productId} does not exist`);
      error.statusCode = 404;
      throw error;
    }

    // Validaciones
    if (updates.price !== undefined && updates.price < 0) {
      const error = new Error('Price cannot be negative');
      error.statusCode = 400;
      throw error;
    }

    if (updates.stock !== undefined && updates.stock < 0) {
      const error = new Error('Stock cannot be negative');
      error.statusCode = 400;
      throw error;
    }

    // Validar categoría si se proporciona
    if (updates.categoryId !== undefined) {
      const catId = parseInt(updates.categoryId);
      if (!this.categoryExists(catId)) {
        const error = new Error(`Cannot update product. Category with id ${catId} does not exist.`);
        error.statusCode = 404;
        throw error;
      }
      updates.categoryId = catId;
    }

    // Validar marca si se proporciona
    if (updates.brandId !== undefined) {
      const brId = parseInt(updates.brandId);
      if (!this.brandExists(brId)) {
        const error = new Error(`Cannot update product. Brand with id ${brId} does not exist.`);
        error.statusCode = 404;
        throw error;
      }
      updates.brandId = brId;
    }

    // Convertir tipos si es necesario
    if (updates.price !== undefined) {
      updates.price = parseFloat(updates.price);
    }
    if (updates.stock !== undefined) {
      updates.stock = parseInt(updates.stock);
    }

    const updatedProduct = {
      ...this.products[productIndex],
      ...updates,
      id: productId,
      updatedAt: new Date()
    };

    this.products[productIndex] = updatedProduct;
    return updatedProduct;
  }

  // Eliminar producto
  delete(id) {
    const productId = parseInt(id);

    const productIndex = this.products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      const error = new Error(`Product with id ${productId} does not exist`);
      error.statusCode = 404;
      throw error;
    }

    const deletedProduct = this.products[productIndex];
    this.products.splice(productIndex, 1);
    return deletedProduct;
  }
}

module.exports = ProductsService
