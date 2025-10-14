const express = require('express');
const BrandsService = require('../services/brandsService');

const router = express.Router();
const service = new BrandsService();

// GET - Obtener todas las marcas
router.get("/", (req, res) => {
  try {
    const { size, active } = req.query;
    const result = service.findAll({ size, active });

    res.status(200).json({
      message: "Brands retrieved successfully",
      data: result.data,
      total: result.total
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message
    });
  }
});

// GET - Obtener marca por ID
router.get("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const brand = service.findOne(id);

    res.status(200).json({
      message: "Brand retrieved successfully",
      data: brand
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message
    });
  }
});

// POST - Crear nueva marca
router.post("/", (req, res) => {
  try {
    const newBrand = service.create(req.body);

    res.status(201).json({
      message: "Brand created successfully",
      data: newBrand
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message
    });
  }
});

// PUT - Actualizar marca completa
router.put("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const updatedBrand = service.update(id, req.body);

    res.status(200).json({
      message: "Brand updated successfully",
      data: updatedBrand
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message
    });
  }
});

// PATCH - Actualizar marca parcialmente
router.patch("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const updatedBrand = service.partialUpdate(id, req.body);

    res.status(200).json({
      message: "Brand updated successfully",
      data: updatedBrand
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message
    });
  }
});

// DELETE - Eliminar marca
router.delete("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const deletedBrand = service.delete(id);

    res.status(200).json({
      message: "Brand deleted successfully",
      data: deletedBrand
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message
    });
  }
});

module.exports = router;
