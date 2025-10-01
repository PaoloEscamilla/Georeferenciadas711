const express = require('express');
const faker = require('faker');

const router = express.Router();

// Base de datos en memoria
let products = [];
let nextId = 1;

// Mock de categorías y marcas para validación
let mockCategories = [];
let mockBrands = [];

// Función para inicializar categorías y marcas mock
function initializeMockData() {
  mockCategories = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, active: true }));
  mockBrands = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, active: true }));
}

// Función auxiliar para generar producto
function generateProduct(id, overrides = {}) {
  return {
    id: id,
    image: faker.image.imageUrl(400, 400, 'product'),
    productName: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    price: parseFloat(faker.commerce.price()),
    stock: faker.datatype.number({ min: 0, max: 100 }),
    categoryId: faker.datatype.number({ min: 1, max: 10 }),
    brandId: faker.datatype.number({ min: 1, max: 10 }),
    createdAt: faker.date.past(),
    ...overrides
  };
}

// Función para validar si existe una categoría
function categoryExists(categoryId) {
  return mockCategories.some(cat => cat.id === categoryId);
}

// Función para validar si existe una marca
function brandExists(brandId) {
  return mockBrands.some(brand => brand.id === brandId);
}

// Inicializar con datos de ejemplo
function initializeProducts() {
  products = [];
  initializeMockData();
  for (let i = 1; i <= 20; i++) {
    products.push(generateProduct(i));
  }
  nextId = 21;
}

initializeProducts();

// ============================================================
// IMPORTANTE: Las rutas específicas DEBEN ir ANTES de /:id
// ============================================================

// GET - Obtener todos los productos
router.get("/", (req, res) => {
  const { size, minPrice, maxPrice, minStock } = req.query;
  let productsList = [...products];

  if (minPrice) {
    productsList = productsList.filter(p => p.price >= parseFloat(minPrice));
  }

  if (maxPrice) {
    productsList = productsList.filter(p => p.price <= parseFloat(maxPrice));
  }

  if (minStock) {
    productsList = productsList.filter(p => p.stock >= parseInt(minStock));
  }

  const limit = size ? parseInt(size) : productsList.length;
  productsList = productsList.slice(0, limit);

  res.status(200).json({
    message: "Products retrieved successfully",
    data: productsList,
    total: products.length
  });
});

// GET - RUTA ESPECÍFICA: Productos por categoría (ANTES de /:id)
router.get("/category/:categoryId", (req, res) => {
  const { categoryId } = req.params;
  const { size } = req.query;
  const catId = parseInt(categoryId);

  if (!categoryExists(catId)) {
    return res.status(404).json({
      error: "Category not found",
      message: `Category with id ${catId} does not exist`
    });
  }

  const productsByCategory = products.filter(p => p.categoryId === catId);

  if (productsByCategory.length === 0) {
    return res.status(404).json({
      error: "No products found",
      message: `No products found for category ${catId}`
    });
  }

  const limit = size ? parseInt(size) : productsByCategory.length;
  const limitedProducts = productsByCategory.slice(0, limit);

  res.status(200).json({
    message: "Products by category retrieved successfully",
    categoryId: catId,
    products: limitedProducts,
    total: productsByCategory.length
  });
});

// GET - RUTA ESPECÍFICA: Productos por marca (ANTES de /:id)
router.get("/brand/:brandId", (req, res) => {
  const { brandId } = req.params;
  const { size } = req.query;
  const brId = parseInt(brandId);

  if (!brandExists(brId)) {
    return res.status(404).json({
      error: "Brand not found",
      message: `Brand with id ${brId} does not exist`
    });
  }

  const productsByBrand = products.filter(p => p.brandId === brId);

  if (productsByBrand.length === 0) {
    return res.status(404).json({
      error: "No products found",
      message: `No products found for brand ${brId}`
    });
  }

  const limit = size ? parseInt(size) : productsByBrand.length;
  const limitedProducts = productsByBrand.slice(0, limit);

  res.status(200).json({
    message: "Products by brand retrieved successfully",
    brandId: brId,
    products: limitedProducts,
    total: productsByBrand.length
  });
});

// GET - RUTA GENÉRICA: Obtener producto por ID (DESPUÉS de rutas específicas)
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const productId = parseInt(id);

  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({
      error: "Product not found",
      message: `Product with id ${productId} does not exist`
    });
  }

  res.status(200).json({
    message: "Product retrieved successfully",
    data: product
  });
});

// POST - Crear nuevo producto
router.post("/", (req, res) => {
  const { productName, description, price, stock, categoryId, brandId, image } = req.body;

  // Validaciones
  if (!productName || price === undefined || categoryId === undefined || brandId === undefined) {
    return res.status(400).json({
      error: "Validation error",
      message: "Product name, price, categoryId and brandId are required"
    });
  }

  if (price < 0) {
    return res.status(400).json({
      error: "Validation error",
      message: "Price cannot be negative"
    });
  }

  if (stock !== undefined && stock < 0) {
    return res.status(400).json({
      error: "Validation error",
      message: "Stock cannot be negative"
    });
  }

  const catId = parseInt(categoryId);
  if (!categoryExists(catId)) {
    return res.status(404).json({
      error: "Category not found",
      message: `Cannot create product. Category with id ${catId} does not exist.`
    });
  }

  const brId = parseInt(brandId);
  if (!brandExists(brId)) {
    return res.status(404).json({
      error: "Brand not found",
      message: `Cannot create product. Brand with id ${brId} does not exist.`
    });
  }

  const newProduct = {
    id: nextId++,
    productName,
    description: description || faker.lorem.paragraph(),
    price: parseFloat(price),
    stock: stock !== undefined ? parseInt(stock) : faker.datatype.number({ min: 0, max: 100 }),
    categoryId: catId,
    brandId: brId,
    image: image || faker.image.imageUrl(400, 400, 'product'),
    createdAt: new Date()
  };

  products.push(newProduct);

  res.status(201).json({
    message: "Product created successfully",
    data: newProduct
  });
});

// PUT - Actualizar producto completo
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const productId = parseInt(id);
  const { productName, description, price, stock, categoryId, brandId, image } = req.body;

  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({
      error: "Product not found",
      message: `Product with id ${productId} does not exist`
    });
  }

  if (!productName || price === undefined || categoryId === undefined || brandId === undefined) {
    return res.status(400).json({
      error: "Validation error",
      message: "Product name, price, categoryId and brandId are required"
    });
  }

  if (price < 0) {
    return res.status(400).json({
      error: "Validation error",
      message: "Price cannot be negative"
    });
  }

  if (stock !== undefined && stock < 0) {
    return res.status(400).json({
      error: "Validation error",
      message: "Stock cannot be negative"
    });
  }

  const catId = parseInt(categoryId);
  if (!categoryExists(catId)) {
    return res.status(404).json({
      error: "Category not found",
      message: `Cannot update product. Category with id ${catId} does not exist.`
    });
  }

  const brId = parseInt(brandId);
  if (!brandExists(brId)) {
    return res.status(404).json({
      error: "Brand not found",
      message: `Cannot update product. Brand with id ${brId} does not exist.`
    });
  }

  const updatedProduct = {
    ...products[productIndex],
    productName,
    description: description || products[productIndex].description,
    price: parseFloat(price),
    stock: stock !== undefined ? parseInt(stock) : products[productIndex].stock,
    categoryId: catId,
    brandId: brId,
    image: image || products[productIndex].image,
    updatedAt: new Date()
  };

  products[productIndex] = updatedProduct;

  res.status(200).json({
    message: "Product updated successfully",
    data: updatedProduct
  });
});

// PATCH - Actualizar producto parcialmente
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const productId = parseInt(id);
  const updates = req.body;

  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({
      error: "Product not found",
      message: `Product with id ${productId} does not exist`
    });
  }

  if (updates.price !== undefined && updates.price < 0) {
    return res.status(400).json({
      error: "Validation error",
      message: "Price cannot be negative"
    });
  }

  if (updates.stock !== undefined && updates.stock < 0) {
    return res.status(400).json({
      error: "Validation error",
      message: "Stock cannot be negative"
    });
  }

  if (updates.categoryId !== undefined) {
    const catId = parseInt(updates.categoryId);
    if (!categoryExists(catId)) {
      return res.status(404).json({
        error: "Category not found",
        message: `Cannot update product. Category with id ${catId} does not exist.`
      });
    }
    updates.categoryId = catId;
  }

  if (updates.brandId !== undefined) {
    const brId = parseInt(updates.brandId);
    if (!brandExists(brId)) {
      return res.status(404).json({
        error: "Brand not found",
        message: `Cannot update product. Brand with id ${brId} does not exist.`
      });
    }
    updates.brandId = brId;
  }

  if (updates.price !== undefined) {
    updates.price = parseFloat(updates.price);
  }
  if (updates.stock !== undefined) {
    updates.stock = parseInt(updates.stock);
  }

  const updatedProduct = {
    ...products[productIndex],
    ...updates,
    id: productId,
    updatedAt: new Date()
  };

  products[productIndex] = updatedProduct;

  res.status(200).json({
    message: "Product updated successfully",
    data: updatedProduct
  });
});

// DELETE - Eliminar producto
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const productId = parseInt(id);

  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({
      error: "Product not found",
      message: `Product with id ${productId} does not exist`
    });
  }

  const deletedProduct = products[productIndex];
  products.splice(productIndex, 1);

  res.status(200).json({
    message: "Product deleted successfully",
    data: deletedProduct
  });
});

module.exports = router;
