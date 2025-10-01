const express = require('express');
const faker = require('faker');

const router = express.Router();

// Base de datos en memoria
let categories = [];
let nextId = 1;

// Mock de productos para validación
let mockProducts = [];

const categoryNames = [
  'Electronics', 'Clothing', 'Home & Garden', 'Sports',
  'Books', 'Toys', 'Automotive', 'Beauty', 'Food', 'Health'
];

// Función para verificar si hay productos asociados a una categoría
function hasAssociatedProducts(categoryId) {
  return mockProducts.some(p => p.categoryId === categoryId);
}

// Inicializar con datos de ejemplo
function initializeCategories() {
  categories = [];
  // Inicializar mock de productos (simula 20 productos)
  mockProducts = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    categoryId: faker.datatype.number({ min: 1, max: 10 })
  }));

  for (let i = 1; i <= 10; i++) {
    categories.push({
      id: i,
      categoryName: categoryNames[i - 1] || faker.commerce.department(),
      description: faker.lorem.sentence(),
      active: faker.datatype.boolean(),
      createdAt: faker.date.past()
    });
  }
  nextId = 11;
}

initializeCategories();

// GET - Obtener todas las categorías
router.get("/", (req, res) => {
  const { size, active } = req.query;
  let categoriesList = [...categories];

  // Filtrar por estado activo si se especifica
  if (active !== undefined) {
    const isActive = active === 'true';
    categoriesList = categoriesList.filter(c => c.active === isActive);
  }

  const limit = size ? parseInt(size) : categoriesList.length;
  categoriesList = categoriesList.slice(0, limit);

  res.status(200).json({
    message: "Categories retrieved successfully",
    data: categoriesList,
    total: categories.length
  });
});

// GET - Obtener categoría por ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const categoryId = parseInt(id);

  const category = categories.find(c => c.id === categoryId);

  if (!category) {
    return res.status(404).json({
      error: "Category not found",
      message: `Category with id ${categoryId} does not exist`
    });
  }

  res.status(200).json({
    message: "Category retrieved successfully",
    data: category
  });
});

// POST - Crear nueva categoría
router.post("/", (req, res) => {
  const { categoryName, description, active } = req.body;

  // Validaciones
  if (!categoryName) {
    return res.status(400).json({
      error: "Validation error",
      message: "Category name is required"
    });
  }

  // Verificar si el nombre ya existe
  const existingCategory = categories.find(
    c => c.categoryName.toLowerCase() === categoryName.toLowerCase()
  );
  if (existingCategory) {
    return res.status(409).json({
      error: "Conflict",
      message: "Category name already exists"
    });
  }

  const newCategory = {
    id: nextId++,
    categoryName,
    description: description || faker.lorem.sentence(),
    active: active !== undefined ? active : true,
    createdAt: new Date()
  };

  categories.push(newCategory);

  res.status(201).json({
    message: "Category created successfully",
    data: newCategory
  });
});

// PUT - Actualizar categoría completa
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const categoryId = parseInt(id);
  const { categoryName, description, active } = req.body;

  const categoryIndex = categories.findIndex(c => c.id === categoryId);

  if (categoryIndex === -1) {
    return res.status(404).json({
      error: "Category not found",
      message: `Category with id ${categoryId} does not exist`
    });
  }

  // Validaciones
  if (!categoryName) {
    return res.status(400).json({
      error: "Validation error",
      message: "Category name is required"
    });
  }

  // Verificar si el nombre ya existe en otra categoría
  const existingCategory = categories.find(
    c => c.categoryName.toLowerCase() === categoryName.toLowerCase() && c.id !== categoryId
  );
  if (existingCategory) {
    return res.status(409).json({
      error: "Conflict",
      message: "Category name already exists"
    });
  }

  const updatedCategory = {
    ...categories[categoryIndex],
    categoryName,
    description: description || categories[categoryIndex].description,
    active: active !== undefined ? active : categories[categoryIndex].active,
    updatedAt: new Date()
  };

  categories[categoryIndex] = updatedCategory;

  res.status(200).json({
    message: "Category updated successfully",
    data: updatedCategory
  });
});

// PATCH - Actualizar categoría parcialmente
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const categoryId = parseInt(id);
  const updates = req.body;

  const categoryIndex = categories.findIndex(c => c.id === categoryId);

  if (categoryIndex === -1) {
    return res.status(404).json({
      error: "Category not found",
      message: `Category with id ${categoryId} does not exist`
    });
  }

  // Si se intenta actualizar el nombre, verificar que no exista
  if (updates.categoryName) {
    const existingCategory = categories.find(
      c => c.categoryName.toLowerCase() === updates.categoryName.toLowerCase() && c.id !== categoryId
    );
    if (existingCategory) {
      return res.status(409).json({
        error: "Conflict",
        message: "Category name already exists"
      });
    }
  }

  const updatedCategory = {
    ...categories[categoryIndex],
    ...updates,
    id: categoryId,
    updatedAt: new Date()
  };

  categories[categoryIndex] = updatedCategory;

  res.status(200).json({
    message: "Category updated successfully",
    data: updatedCategory
  });
});

// DELETE - Eliminar categoría
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const categoryId = parseInt(id);

  const categoryIndex = categories.findIndex(c => c.id === categoryId);

  if (categoryIndex === -1) {
    return res.status(404).json({
      error: "Category not found",
      message: `Category with id ${categoryId} does not exist`
    });
  }

  // ✅ VALIDAR QUE NO HAYA PRODUCTOS ASOCIADOS
  if (hasAssociatedProducts(categoryId)) {
    return res.status(409).json({
      error: "Conflict - Cannot delete",
      message: `Category with id ${categoryId} has associated products and cannot be deleted`,
      suggestion: "Delete or reassign all products in this category first"
    });
  }

  const deletedCategory = categories[categoryIndex];
  categories.splice(categoryIndex, 1);

  res.status(200).json({
    message: "Category deleted successfully",
    data: deletedCategory
  });
});

// DELETE - Eliminar todas las categorías
router.delete("/", (req, res) => {
  // ✅ VALIDAR QUE NO HAYA PRODUCTOS
  if (mockProducts.length > 0) {
    return res.status(409).json({
      error: "Conflict - Cannot delete all",
      message: "Cannot delete all categories while products exist",
      suggestion: "Delete all products first"
    });
  }

  const count = categories.length;
  categories = [];
  nextId = 1;

  res.status(200).json({
    message: "All categories deleted successfully",
    deletedCount: count
  });
});

module.exports = router;
