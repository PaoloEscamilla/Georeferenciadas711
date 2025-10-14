// routes/data.js

// Arrays compartidos
let products = [];
let categories = [];
let brands = [];
let users = [];

// Contadores de IDs
let nextProductId = 1;
let nextCategoryId = 1;
let nextBrandId = 1;
let nextUserId = 1;

// Funciones helper para validar integridad referencial
function hasProductsInCategory(categoryId) {
  return products.some(p => p.categoryId === categoryId);
}

function hasProductsInBrand(brandId) {
  return products.some(p => p.brandId === brandId);
}

function categoryExists(categoryId) {
  return categories.some(c => c.id === categoryId);
}

function brandExists(brandId) {
  return brands.some(b => b.id === brandId);
}

module.exports = {
  // Exportar arrays
  products,
  categories,
  brands,
  users,

  // Exportar contadores
  nextProductId,
  nextCategoryId,
  nextBrandId,
  nextUserId,

  // Exportar funciones helper
  hasProductsInCategory,
  hasProductsInBrand,
  categoryExists,
  brandExists,

  // Funciones para actualizar contadores
  setNextProductId: (id) => { nextProductId = id; },
  setNextCategoryId: (id) => { nextCategoryId = id; },
  setNextBrandId: (id) => { nextBrandId = id; },
  setNextUserId: (id) => { nextUserId = id; }
};
