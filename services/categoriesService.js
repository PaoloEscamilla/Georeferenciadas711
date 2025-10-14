const faker = require('faker');
const { getCategories, getProducts, getNextCategoryId } = require('../data/mockData');

class CategoriesService {
  constructor() {
    this.categories = getCategories();
    this.products = getProducts();
  }

  // Verificar si hay productos asociados a una categoría
  hasAssociatedProducts(categoryId) {
    return this.products.some(p => p.categoryId === categoryId);
  }

  // Obtener todas las categorías con filtros opcionales
  findAll(filters = {}) {
    let categoriesList = [...this.categories];

    // Filtrar por estado activo si se especifica
    if (filters.active !== undefined) {
      const isActive = filters.active === 'true';
      categoriesList = categoriesList.filter(c => c.active === isActive);
    }

    // Aplicar filtro de tamaño si existe
    if (filters.size) {
      const limit = parseInt(filters.size);
      categoriesList = categoriesList.slice(0, limit);
    }

    return {
      data: categoriesList,
      total: this.categories.length
    };
  }

  // Obtener categoría por ID
  findOne(id) {
    const categoryId = parseInt(id);
    const category = this.categories.find(c => c.id === categoryId);

    if (!category) {
      const error = new Error(`Category with id ${categoryId} does not exist`);
      error.statusCode = 404;
      throw error;
    }

    return category;
  }

  // Crear nueva categoría
  create(categoryData) {
    const { categoryName, description, active } = categoryData;

    // Validaciones
    if (!categoryName) {
      const error = new Error('Category name is required');
      error.statusCode = 400;
      throw error;
    }

    // Verificar si el nombre ya existe
    const existingCategory = this.categories.find(
      c => c.categoryName.toLowerCase() === categoryName.toLowerCase()
    );
    if (existingCategory) {
      const error = new Error('Category name already exists');
      error.statusCode = 409;
      throw error;
    }

    const newCategory = {
      id: getNextCategoryId(),
      categoryName,
      description: description || faker.lorem.sentence(),
      active: active !== undefined ? active : true,
      createdAt: new Date()
    };

    this.categories.push(newCategory);
    return newCategory;
  }

  // Actualizar categoría completa (PUT)
  update(id, categoryData) {
    const categoryId = parseInt(id);
    const { categoryName, description, active } = categoryData;

    const categoryIndex = this.categories.findIndex(c => c.id === categoryId);

    if (categoryIndex === -1) {
      const error = new Error(`Category with id ${categoryId} does not exist`);
      error.statusCode = 404;
      throw error;
    }

    // Validaciones
    if (!categoryName) {
      const error = new Error('Category name is required');
      error.statusCode = 400;
      throw error;
    }

    // Verificar si el nombre ya existe en otra categoría
    const existingCategory = this.categories.find(
      c => c.categoryName.toLowerCase() === categoryName.toLowerCase() && c.id !== categoryId
    );
    if (existingCategory) {
      const error = new Error('Category name already exists');
      error.statusCode = 409;
      throw error;
    }

    const updatedCategory = {
      ...this.categories[categoryIndex],
      categoryName,
      description: description || this.categories[categoryIndex].description,
      active: active !== undefined ? active : this.categories[categoryIndex].active,
      updatedAt: new Date()
    };

    this.categories[categoryIndex] = updatedCategory;
    return updatedCategory;
  }

  // Actualizar categoría parcialmente (PATCH)
  partialUpdate(id, updates) {
    const categoryId = parseInt(id);

    const categoryIndex = this.categories.findIndex(c => c.id === categoryId);

    if (categoryIndex === -1) {
      const error = new Error(`Category with id ${categoryId} does not exist`);
      error.statusCode = 404;
      throw error;
    }

    // Si se intenta actualizar el nombre, verificar que no exista
    if (updates.categoryName) {
      const existingCategory = this.categories.find(
        c => c.categoryName.toLowerCase() === updates.categoryName.toLowerCase() && c.id !== categoryId
      );
      if (existingCategory) {
        const error = new Error('Category name already exists');
        error.statusCode = 409;
        throw error;
      }
    }

    const updatedCategory = {
      ...this.categories[categoryIndex],
      ...updates,
      id: categoryId,
      updatedAt: new Date()
    };

    this.categories[categoryIndex] = updatedCategory;
    return updatedCategory;
  }

  // Eliminar categoría
  delete(id) {
    const categoryId = parseInt(id);

    const categoryIndex = this.categories.findIndex(c => c.id === categoryId);

    if (categoryIndex === -1) {
      const error = new Error(`Category with id ${categoryId} does not exist`);
      error.statusCode = 404;
      throw error;
    }

    // Validar que no haya productos asociados
    if (this.hasAssociatedProducts(categoryId)) {
      const error = new Error(
        `Category with id ${categoryId} has associated products and cannot be deleted. Delete or reassign all products in this category first`
      );
      error.statusCode = 409;
      throw error;
    }

    const deletedCategory = this.categories[categoryIndex];
    this.categories.splice(categoryIndex, 1);
    return deletedCategory;
  }

  // Eliminar todas las categorías
  deleteAll() {
    // Validar que no haya productos
    if (this.products.length > 0) {
      const error = new Error(
        'Cannot delete all categories while products exist. Delete all products first'
      );
      error.statusCode = 409;
      throw error;
    }

    const count = this.categories.length;
    this.categories.length = 0;
    return count;
  }
}

module.exports = CategoriesService;
