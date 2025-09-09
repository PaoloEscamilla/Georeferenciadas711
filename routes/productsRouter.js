const express = require('express');
const faker = require('faker');

const router = express.Router();


router.get("/", (req, res) => {
  const productos = [];
  const {size} = req.query;
  const limit = size  || 10;
  for(let index = 0; index < limit; index++) {
    productos.push({
      name: faker.commerce.productName(),
      price: parseInt(faker.commerce.price(), 10),
      image: faker.image.imageUrl()
    });
  }
  res.json(productos);
});

router.get("/:id", (req, res) => {
  const {id} = req.params.id;
  res.json({
    id: id,
    name: 'Producto ' + id,
    price: 100 + parseInt(id)
  });
});


module.exports = router;
