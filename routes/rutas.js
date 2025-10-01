const express = require('express');
const productsRouter = require('./productsRouter');
const usersRouter = require('./usersRouter');
const categoriesRouter = require('./categoriesRouter');
const brandsRouter = require('./brandsRouter');

function routerApi(app) {
  const router = express.Router();

  // Registrar el router principal en /api/v1
  app.use('/api/v1', router);

  // Registrar los routers de cada entidad
  router.use('/users', usersRouter);
  router.use('/categories', categoriesRouter);
  router.use('/brands', brandsRouter);
  router.use('/products', productsRouter);
}

module.exports = routerApi;
