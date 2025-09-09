const express = require('express');
const faker = require('faker');

const router = express.Router();

const brandNames = [
  'Apple', 'Samsung', 'Nike', 'Adidas', 'Sony',
  'Microsoft', 'Google', 'Amazon', 'Tesla', 'Netflix'
];

router.get("/", (req, res) => {
  const brands = [];
  const { size } = req.query;
  const limit = size || 10;

  for(let index = 1; index <= limit; index++) {
    brands.push({
      id: index,
      brandName: brandNames[index - 1] || faker.company.companyName(),
      description: faker.company.catchPhrase(),
      active: faker.datatype.boolean()
    });
  }

  res.json(brands);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const brandIndex = parseInt(id) - 1;

  res.json({
    id: parseInt(id),
    brandName: brandNames[brandIndex] || faker.company.companyName(),
    description: faker.company.catchPhrase(),
    active: faker.datatype.boolean()
  });
});

module.exports = router;
