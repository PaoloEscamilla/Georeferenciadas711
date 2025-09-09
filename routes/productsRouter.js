const express = require('express');
const faker = require('faker');

const router = express.Router();

function generateProduct(id) {
  return {
    id: id,
    image: faker.image.imageUrl(400, 400, 'product'),
    productName: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    price: parseFloat(faker.commerce.price()),
    stock: faker.datatype.number({ min: 0, max: 100 }),
    categoryId: faker.datatype.number({ min: 1, max: 10 }),
    brandId: faker.datatype.number({ min: 1, max: 10 })
  };
}

router.get("/", (req, res) => {
  const products = [];
  const { size } = req.query;
  const limit = size || 10;

  for(let index = 1; index <= limit; index++) {
    products.push(generateProduct(index));
  }

  res.json(products);
});

router.get("/category/:categoryId", (req, res) => {
  const { categoryId } = req.params;
  const { size } = req.query;
  const limit = size || 5;
  const products = [];

  for(let index = 1; index <= limit; index++) {
    const product = generateProduct(index);
    product.categoryId = parseInt(categoryId);
    products.push(product);
  }

  res.json({
    categoryId: parseInt(categoryId),
    products: products
  });
});

router.get("/brand/:brandId", (req, res) => {
  const { brandId } = req.params;
  const { size } = req.query;
  const limit = size || 5;
  const products = [];

  for(let index = 1; index <= limit; index++) {
    const product = generateProduct(index);
    product.brandId = parseInt(brandId);
    products.push(product);
  }

  res.json({
    brandId: parseInt(brandId),
    products: products
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.json(generateProduct(parseInt(id)));
});

module.exports = router;
