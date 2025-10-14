const express = require('express');
const UsersService = require('../services/usersService');

const router = express.Router();
const service = new UsersService();

// GET - Obtener todos los usuarios
router.get("/", (req, res) => {
  try {
    const { size } = req.query;
    const result = service.findAll({ size });

    res.status(200).json({
      message: "Users retrieved successfully",
      data: result.data,
      total: result.total
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message
    });
  }
});

// GET - Obtener usuario por ID
router.get("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const user = service.findOne(id);

    res.status(200).json({
      message: "User retrieved successfully",
      data: user
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message
    });
  }
});

// POST - Crear nuevo usuario
router.post("/", (req, res) => {
  try {
    const newUser = service.create(req.body);

    res.status(201).json({
      message: "User created successfully",
      data: newUser
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message
    });
  }
});

// PUT - Actualizar usuario completo
router.put("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = service.update(id, req.body);

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message
    });
  }
});

// PATCH - Actualizar usuario parcialmente
router.patch("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = service.partialUpdate(id, req.body);

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message
    });
  }
});

// DELETE - Eliminar usuario
router.delete("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = service.delete(id);

    res.status(200).json({
      message: "User deleted successfully",
      data: deletedUser
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message
    });
  }
});

module.exports = router;
