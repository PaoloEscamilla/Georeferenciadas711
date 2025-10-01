const express = require('express');
const routerApi = require('./routes/rutas');
const app = express();
const port = 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    message: 'E-commerce API REST',
    version: '1.0.0',
    description: 'API REST con operaciones CRUD completas',
    documentation: {
      users: {
        'GET /api/v1/users': 'Obtener todos los usuarios',
        'GET /api/v1/users/:id': 'Obtener usuario por ID',
        'POST /api/v1/users': 'Crear nuevo usuario',
        'PUT /api/v1/users/:id': 'Actualizar usuario completo',
        'PATCH /api/v1/users/:id': 'Actualizar usuario parcialmente',
        'DELETE /api/v1/users/:id': 'Eliminar usuario'
      },
      categories: {
        'GET /api/v1/categories': 'Obtener todas las categorías',
        'GET /api/v1/categories/:id': 'Obtener categoría por ID',
        'POST /api/v1/categories': 'Crear nueva categoría',
        'PUT /api/v1/categories/:id': 'Actualizar categoría completa',
        'PATCH /api/v1/categories/:id': 'Actualizar categoría parcialmente',
        'DELETE /api/v1/categories/:id': 'Eliminar categoría'
      },
      brands: {
        'GET /api/v1/brands': 'Obtener todas las marcas',
        'GET /api/v1/brands/:id': 'Obtener marca por ID',
        'POST /api/v1/brands': 'Crear nueva marca',
        'PUT /api/v1/brands/:id': 'Actualizar marca completa',
        'PATCH /api/v1/brands/:id': 'Actualizar marca parcialmente',
        'DELETE /api/v1/brands/:id': 'Eliminar marca'
      },
      products: {
        'GET /api/v1/products': 'Obtener todos los productos',
        'GET /api/v1/products/:id': 'Obtener producto por ID',
        'GET /api/v1/products/category/:categoryId': 'Obtener productos por categoría',
        'GET /api/v1/products/brand/:brandId': 'Obtener productos por marca',
        'POST /api/v1/products': 'Crear nuevo producto',
        'PUT /api/v1/products/:id': 'Actualizar producto completo',
        'PATCH /api/v1/products/:id': 'Actualizar producto parcialmente',
        'DELETE /api/v1/products/:id': 'Eliminar producto'
      }
    },
    examples: {
      createUser: {
        method: 'POST',
        endpoint: '/api/v1/users',
        body: {
          name: 'John Doe',
          username: 'johndoe',
          password: 'password123',
          email: 'john@example.com'
        }
      },
      createProduct: {
        method: 'POST',
        endpoint: '/api/v1/products',
        body: {
          productName: 'Gaming Mouse',
          description: 'High precision gaming mouse',
          price: 79.99,
          stock: 50,
          categoryId: 1,
          brandId: 2
        }
      }
    }
  });
});

// Registrar las rutas de la API
routerApi(app);

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe`,
    availableRoutes: [
      'GET /',
      'GET /api/v1/users',
      'POST /api/v1/users',
      'PUT /api/v1/users/:id',
      'PATCH /api/v1/users/:id',
      'DELETE /api/v1/users/:id',
      'GET /api/v1/categories',
      'POST /api/v1/categories',
      'PUT /api/v1/categories/:id',
      'PATCH /api/v1/categories/:id',
      'DELETE /api/v1/categories/:id',
      'GET /api/v1/brands',
      'POST /api/v1/brands',
      'PUT /api/v1/brands/:id',
      'PATCH /api/v1/brands/:id',
      'DELETE /api/v1/brands/:id',
      'GET /api/v1/products',
      'POST /api/v1/products',
      'PUT /api/v1/products/:id',
      'PATCH /api/v1/products/:id',
      'DELETE /api/v1/products/:id',
      'GET /api/v1/products/category/:categoryId',
      'GET /api/v1/products/brand/:brandId'
    ]
  });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

app.listen(port, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 API REST E-commerce - Servidor Iniciado');
  console.log('='.repeat(60));
  console.log(`\n📡 URL Base: http://localhost:${port}`);
  console.log(`📚 Documentación: http://localhost:${port}`);
  console.log(`🔗 API Endpoint: http://localhost:${port}/api/v1\n`);

  console.log('📋 RUTAS DISPONIBLES:\n');

  console.log('👥 USERS:');
  console.log('   GET    /api/v1/users');
  console.log('   GET    /api/v1/users/:id');
  console.log('   POST   /api/v1/users');
  console.log('   PUT    /api/v1/users/:id');
  console.log('   PATCH  /api/v1/users/:id');
  console.log('   DELETE /api/v1/users/:id\n');

  console.log('📂 CATEGORIES:');
  console.log('   GET    /api/v1/categories');
  console.log('   GET    /api/v1/categories/:id');
  console.log('   POST   /api/v1/categories');
  console.log('   PUT    /api/v1/categories/:id');
  console.log('   PATCH  /api/v1/categories/:id');
  console.log('   DELETE /api/v1/categories/:id\n');

  console.log('🏷️  BRANDS:');
  console.log('   GET    /api/v1/brands');
  console.log('   GET    /api/v1/brands/:id');
  console.log('   POST   /api/v1/brands');
  console.log('   PUT    /api/v1/brands/:id');
  console.log('   PATCH  /api/v1/brands/:id');
  console.log('   DELETE /api/v1/brands/:id\n');

  console.log('🛍️  PRODUCTS:');
  console.log('   GET    /api/v1/products');
  console.log('   GET    /api/v1/products/:id');
  console.log('   GET    /api/v1/products/category/:categoryId');
  console.log('   GET    /api/v1/products/brand/:brandId');
  console.log('   POST   /api/v1/products');
  console.log('   PUT    /api/v1/products/:id');
  console.log('   PATCH  /api/v1/products/:id');
  console.log('   DELETE /api/v1/products/:id\n');

  console.log('='.repeat(60));
  console.log('✅ API lista para recibir peticiones');
  console.log('💡 Prueba con: curl http://localhost:3000');
  console.log('='.repeat(60) + '\n');
});
