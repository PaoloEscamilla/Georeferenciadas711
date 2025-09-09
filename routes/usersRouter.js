const express = require('express');
const faker = require('faker');

const router = express.Router();

// Obtener todos los usuarios
router.get("/", (req, res) => {
  const users = [];
  const { size } = req.query;
  const limit = size || 10;

  for(let index = 1; index <= limit; index++) {
    users.push({
      id: index,
      name: faker.name.findName(),
      username: faker.internet.userName(),
      password: faker.internet.password()
    });
  }

  res.json(users);
});

// Obtener usuario por ID
router.get("/:id", (req, res) => {
  const { id } = req.params;

  res.json({
    id: parseInt(id),
    name: faker.name.findName(),
    username: faker.internet.userName(),
    password: faker.internet.password()
  });
});

module.exports = router;
