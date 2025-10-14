const faker = require('faker');

// Base de datos en memoria
const db = {
  users: [],
  categories: [],
  brands: [],
  products: [],
  counters: {
    users: 1,
    categories: 1,
    brands: 1,
    products: 1
  }
};

// Nombres predefinidos para mayor realismo
const categoryNames = [
  'Electronics', 'Clothing', 'Home & Garden', 'Sports',
  'Books', 'Toys', 'Automotive', 'Beauty', 'Food', 'Health'
];

const brandNames = [
  'Apple', 'Samsung', 'Nike', 'Adidas', 'Sony',
  'Microsoft', 'Google', 'Amazon', 'Tesla', 'Netflix'
];

// Función de inicialización
function initializeDatabase() {
  // Inicializar usuarios
  db.users = [];
  for (let i = 1; i <= 10; i++) {
    db.users.push({
      id: i,
      name: faker.name.findName(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      createdAt: faker.date.past()
    });
  }
  db.counters.users = 11;

  // Inicializar categorías
  db.categories = [];
  for (let i = 1; i <= 10; i++) {
    db.categories.push({
      id: i,
      categoryName: categoryNames[i - 1] || faker.commerce.department(),
      description: faker.lorem.sentence(),
      active: faker.datatype.boolean(),
      createdAt: faker.date.past()
    });
  }
  db.counters.categories = 11;

  // Inicializar marcas
  db.brands = [];
  for (let i = 1; i <= 10; i++) {
    db.brands.push({
      id: i,
      brandName: brandNames[i - 1] || faker.company.companyName(),
      description: faker.company.catchPhrase(),
      active: faker.datatype.boolean(),
      country: faker.address.country(),
      createdAt: faker.date.past()
    });
  }
  db.counters.brands = 11;

  // Inicializar productos
  db.products = [];
  for (let i = 1; i <= 20; i++) {
    db.products.push({
      id: i,
      image: faker.image.imageUrl(400, 400, 'product'),
      productName: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      price: parseFloat(faker.commerce.price()),
      stock: faker.datatype.number({ min: 0, max: 100 }),
      categoryId: faker.datatype.number({ min: 1, max: 10 }),
      brandId: faker.datatype.number({ min: 1, max: 10 }),
      createdAt: faker.date.past()
    });
  }
  db.counters.products = 21;
}

// Inicializar la base de datos
initializeDatabase();

// Exportar la base de datos y funciones auxiliares
module.exports = {
  db,
  initializeDatabase,
  // Getters para acceso a datos
  getUsers: () => db.users,
  getCategories: () => db.categories,
  getBrands: () => db.brands,
  getProducts: () => db.products,
  // Getters para contadores
  getNextUserId: () => db.counters.users++,
  getNextCategoryId: () => db.counters.categories++,
  getNextBrandId: () => db.counters.brands++,
  getNextProductId: () => db.counters.products++
};
