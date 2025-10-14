const faker = require('faker');
const { getUsers, getNextUserId } = require('../data/mockData');

class UsersService {
  constructor() {
    this.users = getUsers();
  }

  // Obtener todos los usuarios con filtros opcionales
  findAll(filters = {}) {
    let usersList = [...this.users];

    // Aplicar filtro de tamaño si existe
    if (filters.size) {
      const limit = parseInt(filters.size);
      usersList = usersList.slice(0, limit);
    }

    return {
      data: usersList,
      total: this.users.length
    };
  }

  // Obtener usuario por ID
  findOne(id) {
    const userId = parseInt(id);
    const user = this.users.find(u => u.id === userId);

    if (!user) {
      const error = new Error(`User with id ${userId} does not exist`);
      error.statusCode = 404;
      throw error;
    }

    return user;
  }

  // Crear nuevo usuario
  create(userData) {
    const { name, username, password, email } = userData;

    // Validaciones
    if (!name || !username || !password) {
      const error = new Error('Name, username and password are required');
      error.statusCode = 400;
      throw error;
    }

    // Verificar si el username ya existe
    const existingUser = this.users.find(u => u.username === username);
    if (existingUser) {
      const error = new Error('Username already exists');
      error.statusCode = 409;
      throw error;
    }

    // Crear nuevo usuario
    const newUser = {
      id: getNextUserId(),
      name,
      username,
      password,
      email: email || faker.internet.email(),
      createdAt: new Date()
    };

    this.users.push(newUser);
    return newUser;
  }

  // Actualizar usuario completo (PUT)
  update(id, userData) {
    const userId = parseInt(id);
    const { name, username, password, email } = userData;

    const userIndex = this.users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      const error = new Error(`User with id ${userId} does not exist`);
      error.statusCode = 404;
      throw error;
    }

    // Validaciones
    if (!name || !username || !password) {
      const error = new Error('Name, username and password are required');
      error.statusCode = 400;
      throw error;
    }

    // Verificar si el username ya existe en otro usuario
    const existingUser = this.users.find(
      u => u.username === username && u.id !== userId
    );
    if (existingUser) {
      const error = new Error('Username already exists');
      error.statusCode = 409;
      throw error;
    }

    const updatedUser = {
      ...this.users[userIndex],
      name,
      username,
      password,
      email: email || this.users[userIndex].email,
      updatedAt: new Date()
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  // Actualizar usuario parcialmente (PATCH)
  partialUpdate(id, updates) {
    const userId = parseInt(id);

    const userIndex = this.users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      const error = new Error(`User with id ${userId} does not exist`);
      error.statusCode = 404;
      throw error;
    }

    // Si se intenta actualizar el username, verificar que no exista
    if (updates.username) {
      const existingUser = this.users.find(
        u => u.username === updates.username && u.id !== userId
      );
      if (existingUser) {
        const error = new Error('Username already exists');
        error.statusCode = 409;
        throw error;
      }
    }

    const updatedUser = {
      ...this.users[userIndex],
      ...updates,
      id: userId,
      updatedAt: new Date()
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  // Eliminar usuario
  delete(id) {
    const userId = parseInt(id);

    const userIndex = this.users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      const error = new Error(`User with id ${userId} does not exist`);
      error.statusCode = 404;
      throw error;
    }

    const deletedUser = this.users[userIndex];
    this.users.splice(userIndex, 1);
    return deletedUser;
  }
}

module.exports = UsersService;
