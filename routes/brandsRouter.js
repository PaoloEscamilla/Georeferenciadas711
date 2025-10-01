const express = require('express');
const faker = require('faker');

const router = express.Router();

// Base de datos en memoria
let brands = [];
let nextId = 1;

const brandNames = [
  'Apple', 'Samsung', 'Nike', 'Adidas', 'Sony',
  'Microsoft', 'Google', 'Amazon', 'Tesla', 'Netflix'
];

// Inicializar con datos de ejemplo
function initializeBrands() {
  brands = [];
  for (let i = 1; i <= 10; i++) {
    brands.push({
      id: i,
      brandName: brandNames[i - 1] || faker.company.companyName(),
      description: faker.company.catchPhrase(),
      active: faker.datatype.boolean(),
      country: faker.address.country(),
      createdAt: faker.date.past()
    });
  }
  nextId = 11;
}

initializeBrands();

// GET - Obtener todas las marcas
router.get("/", (req, res) => {
  const { size, active } = req.query;
  let brandsList = [...brands];

  // Filtrar por estado activo si se especifica
  if (active !== undefined) {
    const isActive = active === 'true';
    brandsList = brandsList.filter(b => b.active === isActive);
  }

  const limit = size ? parseInt(size) : brandsList.length;
  brandsList = brandsList.slice(0, limit);

  res.status(200).json({
    message: "Brands retrieved successfully",
    data: brandsList,
    total: brands.length
  });
});

// GET - Obtener marca por ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const brandId = parseInt(id);

  const brand = brands.find(b => b.id === brandId);

  if (!brand) {
    return res.status(404).json({
      error: "Brand not found",
      message: `Brand with id ${brandId} does not exist`
    });
  }

  res.status(200).json({
    message: "Brand retrieved successfully",
    data: brand
  });
});

// POST - Crear nueva marca
router.post("/", (req, res) => {
  const { brandName, description, active, country } = req.body;

  // Validaciones
  if (!brandName) {
    return res.status(400).json({
      error: "Validation error",
      message: "Brand name is required"
    });
  }

  // Verificar si el nombre ya existe
  const existingBrand = brands.find(
    b => b.brandName.toLowerCase() === brandName.toLowerCase()
  );
  if (existingBrand) {
    return res.status(409).json({
      error: "Conflict",
      message: "Brand name already exists"
    });
  }

  const newBrand = {
    id: nextId++,
    brandName,
    description: description || faker.company.catchPhrase(),
    active: active !== undefined ? active : true,
    country: country || faker.address.country(),
    createdAt: new Date()
  };

  brands.push(newBrand);

  res.status(201).json({
    message: "Brand created successfully",
    data: newBrand
  });
});

// PUT - Actualizar marca completa
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const brandId = parseInt(id);
  const { brandName, description, active, country } = req.body;

  const brandIndex = brands.findIndex(b => b.id === brandId);

  if (brandIndex === -1) {
    return res.status(404).json({
      error: "Brand not found",
      message: `Brand with id ${brandId} does not exist`
    });
  }

  // Validaciones
  if (!brandName) {
    return res.status(400).json({
      error: "Validation error",
      message: "Brand name is required"
    });
  }

  // Verificar si el nombre ya existe en otra marca
  const existingBrand = brands.find(
    b => b.brandName.toLowerCase() === brandName.toLowerCase() && b.id !== brandId
  );
  if (existingBrand) {
    return res.status(409).json({
      error: "Conflict",
      message: "Brand name already exists"
    });
  }

  const updatedBrand = {
    ...brands[brandIndex],
    brandName,
    description: description || brands[brandIndex].description,
    active: active !== undefined ? active : brands[brandIndex].active,
    country: country || brands[brandIndex].country,
    updatedAt: new Date()
  };

  brands[brandIndex] = updatedBrand;

  res.status(200).json({
    message: "Brand updated successfully",
    data: updatedBrand
  });
});

// PATCH - Actualizar marca parcialmente
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const brandId = parseInt(id);
  const updates = req.body;

  const brandIndex = brands.findIndex(b => b.id === brandId);

  if (brandIndex === -1) {
    return res.status(404).json({
      error: "Brand not found",
      message: `Brand with id ${brandId} does not exist`
    });
  }

  // Si se intenta actualizar el nombre, verificar que no exista
  if (updates.brandName) {
    const existingBrand = brands.find(
      b => b.brandName.toLowerCase() === updates.brandName.toLowerCase() && b.id !== brandId
    );
    if (existingBrand) {
      return res.status(409).json({
        error: "Conflict",
        message: "Brand name already exists"
      });
    }
  }

  const updatedBrand = {
    ...brands[brandIndex],
    ...updates,
    id: brandId,
    updatedAt: new Date()
  };

  brands[brandIndex] = updatedBrand;

  res.status(200).json({
    message: "Brand updated successfully",
    data: updatedBrand
  });
});

// DELETE - Eliminar marca
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const brandId = parseInt(id);

  const brandIndex = brands.findIndex(b => b.id === brandId);

  if (brandIndex === -1) {
    return res.status(404).json({
      error: "Brand not found",
      message: `Brand with id ${brandId} does not exist`
    });
  }

  const deletedBrand = brands[brandIndex];
  brands.splice(brandIndex, 1);

  res.status(200).json({
    message: "Brand deleted successfully",
    data: deletedBrand
  });
});

module.exports = router;
