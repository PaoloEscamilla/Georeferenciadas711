const express = require('express');
const faker = require('faker');

const router = express.Router();

// Base de datos en memoria
let users = [];
let nextId = 1;

// Inicializar con datos de ejemplo
function initializeUsers() {
  users = [];
  for (let i = 1; i <= 10; i++) {
    users.push({
      id: i,
      name: faker.name.findName(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      createdAt: faker.date.past()
    });
  }
  nextId = 11;
}

initializeUsers();

// GET - Obtener todos los usuarios
router.get("/", (req, res) => {
  const { size } = req.query;
  const limit = size ? parseInt(size) : users.length;

  const usersList = users.slice(0, limit);

  res.status(200).json({
    message: "Users retrieved successfully",
    data: usersList,
    total: users.length
  });
});

// GET - Obtener usuario por ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const userId = parseInt(id);

  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({
      error: "User not found",
      message: `User with id ${userId} does not exist`
    });
  }

  res.status(200).json({
    message: "User retrieved successfully",
    data: user
  });
});

// POST - Crear nuevo usuario
router.post("/", (req, res) => {
  const { name, username, password, email } = req.body;

  // Validaciones
  if (!name || !username || !password) {
    return res.status(400).json({
      error: "Validation error",
      message: "Name, username and password are required"
    });
  }

  // Verificar si el username ya existe
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(409).json({
      error: "Conflict",
      message: "Username already exists"
    });
  }

  const newUser = {
    id: nextId++,
    name,
    username,
    password,
    email: email || faker.internet.email(),
    createdAt: new Date()
  };

  users.push(newUser);

  res.status(201).json({
    message: "User created successfully",
    data: newUser
  });
});

// PUT - Actualizar usuario completo
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const userId = parseInt(id);
  const { name, username, password, email } = req.body;

  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({
      error: "User not found",
      message: `User with id ${userId} does not exist`
    });
  }

  // Validaciones
  if (!name || !username || !password) {
    return res.status(400).json({
      error: "Validation error",
      message: "Name, username and password are required"
    });
  }

  // Verificar si el username ya existe en otro usuario
  const existingUser = users.find(u => u.username === username && u.id !== userId);
  if (existingUser) {
    return res.status(409).json({
      error: "Conflict",
      message: "Username already exists"
    });
  }

  const updatedUser = {
    ...users[userIndex],
    name,
    username,
    password,
    email: email || users[userIndex].email,
    updatedAt: new Date()
  };

  users[userIndex] = updatedUser;

  res.status(200).json({
    message: "User updated successfully",
    data: updatedUser
  });
});

// PATCH - Actualizar usuario parcialmente
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const userId = parseInt(id);
  const updates = req.body;

  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({
      error: "User not found",
      message: `User with id ${userId} does not exist`
    });
  }

  // Si se intenta actualizar el username, verificar que no exista
  if (updates.username) {
    const existingUser = users.find(u => u.username === updates.username && u.id !== userId);
    if (existingUser) {
      return res.status(409).json({
        error: "Conflict",
        message: "Username already exists"
      });
    }
  }

  const updatedUser = {
    ...users[userIndex],
    ...updates,
    id: userId, // Mantener el ID original
    updatedAt: new Date()
  };

  users[userIndex] = updatedUser;

  res.status(200).json({
    message: "User updated successfully",
    data: updatedUser
  });
});

// DELETE - Eliminar usuario
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const userId = parseInt(id);

  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({
      error: "User not found",
      message: `User with id ${userId} does not exist`
    });
  }

  const deletedUser = users[userIndex];
  users.splice(userIndex, 1);

  res.status(200).json({
    message: "User deleted successfully",
    data: deletedUser
  });
});

module.exports = router;
