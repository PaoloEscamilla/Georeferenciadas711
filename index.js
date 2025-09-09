const express = require('express');
const path = require('path');
const routerApi = require('./routes/rutas');
const app = express();
const port = 3000;

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear JSON (si necesitas POST requests en el futuro)
app.use(express.json());

// Ruta principal que sirve el frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta de ejemplo (puedes mantenerla o quitarla)
app.get("/nuevaruta", (req, res) => {
  res.send("Hola desde la nueva ruta");
});

// Registrar las rutas de la API
routerApi(app);

// Ruta de ejemplo con parámetros (puedes mantenerla o quitarla)
app.get("/categories/:categoryId/products/:productId", (req, res) => {
  const {categoryId, productId} = req.params;
  res.json({
    categoryId,
    productId
  });
});

// Ruta de ejemplo con query parameters (puedes mantenerla o quitarla)
app.get("/users", (req, res) => {
  const {username, lastname} = req.query;
  if(username && lastname) {
    res.json({
      username,
      lastname
    });
  } else {
    res.status(400).json({error: "Faltan parametros query"});
  }
});

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe`,
    availableRoutes: [
      'GET /',
      'GET /api/v1/users',
      'GET /api/v1/categories',
      'GET /api/v1/brands',
      'GET /api/v1/products'
    ]
  });
});

app.listen(port, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${port}`);
  console.log(`📱 Frontend disponible en: http://localhost:${port}`);
  console.log(`🔗 API disponible en: http://localhost:${port}/api/v1`);
  console.log('📚 Rutas disponibles:');
  console.log('   - GET /api/v1/users');
  console.log('   - GET /api/v1/users/:id');
  console.log('   - GET /api/v1/categories');
  console.log('   - GET /api/v1/categories/:id');
  console.log('   - GET /api/v1/brands');
  console.log('   - GET /api/v1/brands/:id');
  console.log('   - GET /api/v1/products');
  console.log('   - GET /api/v1/products/:id');
  console.log('   - GET /api/v1/products/category/:categoryId');
  console.log('   - GET /api/v1/products/brand/:brandId');
});
