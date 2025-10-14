const express = require('express');
const CategoriesService = require('../services/categoriesService');

const router = express.Router();
const service = new CategoriesService();

// GET - Obtener todas las categorías
router.get("/", (req, res) => {
  try {
    const { size, active } = req.query;
    const result = service.findAll({ size, active });

    res.status(200).json({
      message: "Categories retrieved successfully",
      data: result.data,
      total: result.total
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message
    });
  }
});

// GET - Obtener categoría por ID
router.get("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const category = service.findOne(id);

    res.status(200).json({
      message: "Category retrieved successfully",
      data: category
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message
    });
  }
});

// POST - Crear nueva categoría
router.post("/", (req, res) => {
  try {
    const newCategory = service.create(req.body);

    res.status(201).json({
      message: "Category created successfully",
      data: newCategory
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message
    });
  }
});

// PUT - Actualizar categoría completa
router.put("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = service.update(id, req.body);

    res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message
    });
  }
});

// PATCH - Actualizar categoría parcialmente
router.patch("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = service.partialUpdate(id, req.body);

    res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message
    });
  }
});

// DELETE - Eliminar categoría
router.delete("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = service.delete(id);

    res.status(200).json({
      message: "Category deleted successfully",
      data: deletedCategory
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message
    });
  }
});

// DELETE - Eliminar todas las categorías
router.delete("/", (req, res) => {
  try {
    const count = service.deleteAll();

    res.status(200).json({
      message: "All categories deleted successfully",
      deletedCount: count
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message
    });
  }
});

module.exports = router;
