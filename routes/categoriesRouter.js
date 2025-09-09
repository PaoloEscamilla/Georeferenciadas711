const express = require('express');
const faker = require('faker');

const router = express.Router();

const categoryNames = [
  'Electronics', 'Clothing', 'Home & Garden', 'Sports',
  'Books', 'Toys', 'Automotive', 'Beauty', 'Food', 'Health'
];

router.get("/", (req, res) => {
  const categories = [];
  const { size } = req.query;
  const limit = size || 10;

  for(let index = 1; index <= limit; index++) {
    categories.push({
      id: index,
      categoryName: categoryNames[index - 1] || faker.commerce.department(),
      description: faker.lorem.sentence(),
      active: faker.datatype.boolean()
    });
  }

  res.json(categories);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const categoryIndex = parseInt(id) - 1;

  res.json({
    id: parseInt(id),
    categoryName: categoryNames[categoryIndex] || faker.commerce.department(),
    description: faker.lorem.sentence(),
    active: faker.datatype.boolean()
  });
});

module.exports = router;
