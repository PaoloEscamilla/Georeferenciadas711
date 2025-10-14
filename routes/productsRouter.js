const express = require('express');
const ProductsService = require('../services/productsService');

const router = express.Router();
const service = new ProductsService();

// ============================================================
// IMPORTANTE: Las rutas específicas DEBEN ir ANTES de /:id
// ============================================================

// GET - Obtener todos los productos
router.get("/", (req, res) => {
  try {
    const { size, minPrice, maxPrice, minStock } = req.query;
    const result = service.findAll({ size, minPrice, maxPrice, minStock });

    res.status(200).json({
      message: "Products retrieved successfully",
      data: result.data,
      total: result.total
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message
    });
  }
});

// GET - RUTA ESPECÍFICA: Productos por categoría (ANTES de /:id)
router.get("/category/:categoryId", (req, res) => {
  try {
    const { categoryId } = req.params;
    const { size } = req.query;
    const result = service.findByCategory(categoryId, { size });

    res.status(200).json({
      message: "Products by category retrieved successfully",
      categoryId: result.categoryId,
      products: result.data,
      total: result.total
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message
    });
  }
});

// GET - RUTA ESPECÍFICA: Productos por marca (ANTES de /:id)
router.get("/brand/:brandId", (req, res) => {
  try {
    const { brandId } = req.params;
    const { size } = req.query;
    const result = service.findByBrand(brandId, { size });

    res.status(200).json({
      message: "Products by brand retrieved successfully",
      brandId: result.brandId,
      products: result.data,
      total: result.total
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message
    });
  }
});

// GET - RUTA GENÉRICA: Obtener producto por ID (DESPUÉS de rutas específicas)
router.get("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const product = service.findOne(id);

    res.status(200).json({
      message: "Product retrieved successfully",
      data: product
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message
    });
  }
});

// POST - Crear nuevo producto
router.post("/", (req, res) => {
  try {
    const newProduct = service.create(req.body);

    res.status(201).json({
      message: "Product created successfully",
      data: newProduct
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message
    });
  }
});

// PUT - Actualizar producto completo
router.put("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = service.update(id, req.body);

    res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message
    });
  }
});

// PATCH - Actualizar producto parcialmente
router.patch("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = service.partialUpdate(id, req.body);

    res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message
    });
  }
});

// DELETE - Eliminar producto
router.delete("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = service.delete(id);

    res.status(200).json({
      message: "Product deleted successfully",
      data: deletedProduct
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message
    });
  }
});

module.exports = router;
