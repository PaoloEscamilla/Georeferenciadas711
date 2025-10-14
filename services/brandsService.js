const faker = require('faker');
const { getBrands, getNextBrandId } = require('../data/mockData');

class BrandsService {
  constructor() {
    this.brands = getBrands();
  }

  // Obtener todas las marcas con filtros opcionales
  findAll(filters = {}) {
    let brandsList = [...this.brands];

    // Filtrar por estado activo si se especifica
    if (filters.active !== undefined) {
      const isActive = filters.active === 'true';
      brandsList = brandsList.filter(b => b.active === isActive);
    }

    // Aplicar filtro de tamaño si existe
    if (filters.size) {
      const limit = parseInt(filters.size);
      brandsList = brandsList.slice(0, limit);
    }

    return {
      data: brandsList,
      total: this.brands.length
    };
  }

  // Obtener marca por ID
  findOne(id) {
    const brandId = parseInt(id);
    const brand = this.brands.find(b => b.id === brandId);

    if (!brand) {
      const error = new Error(`Brand with id ${brandId} does not exist`);
      error.statusCode = 404;
      throw error;
    }

    return brand;
  }

  // Crear nueva marca
  create(brandData) {
    const { brandName, description, active, country } = brandData;

    // Validaciones
    if (!brandName) {
      const error = new Error('Brand name is required');
      error.statusCode = 400;
      throw error;
    }

    // Verificar si el nombre ya existe
    const existingBrand = this.brands.find(
      b => b.brandName.toLowerCase() === brandName.toLowerCase()
    );
    if (existingBrand) {
      const error = new Error('Brand name already exists');
      error.statusCode = 409;
      throw error;
    }

    const newBrand = {
      id: getNextBrandId(),
      brandName,
      description: description || faker.company.catchPhrase(),
      active: active !== undefined ? active : true,
      country: country || faker.address.country(),
      createdAt: new Date()
    };

    this.brands.push(newBrand);
    return newBrand;
  }

  // Actualizar marca completa (PUT)
  update(id, brandData) {
    const brandId = parseInt(id);
    const { brandName, description, active, country } = brandData;

    const brandIndex = this.brands.findIndex(b => b.id === brandId);

    if (brandIndex === -1) {
      const error = new Error(`Brand with id ${brandId} does not exist`);
      error.statusCode = 404;
      throw error;
    }

    // Validaciones
    if (!brandName) {
      const error = new Error('Brand name is required');
      error.statusCode = 400;
      throw error;
    }

    // Verificar si el nombre ya existe en otra marca
    const existingBrand = this.brands.find(
      b => b.brandName.toLowerCase() === brandName.toLowerCase() && b.id !== brandId
    );
    if (existingBrand) {
      const error = new Error('Brand name already exists');
      error.statusCode = 409;
      throw error;
    }

    const updatedBrand = {
      ...this.brands[brandIndex],
      brandName,
      description: description || this.brands[brandIndex].description,
      active: active !== undefined ? active : this.brands[brandIndex].active,
      country: country || this.brands[brandIndex].country,
      updatedAt: new Date()
    };

    this.brands[brandIndex] = updatedBrand;
    return updatedBrand;
  }

  // Actualizar marca parcialmente (PATCH)
  partialUpdate(id, updates) {
    const brandId = parseInt(id);

    const brandIndex = this.brands.findIndex(b => b.id === brandId);

    if (brandIndex === -1) {
      const error = new Error(`Brand with id ${brandId} does not exist`);
      error.statusCode = 404;
      throw error;
    }

    // Si se intenta actualizar el nombre, verificar que no exista
    if (updates.brandName) {
      const existingBrand = this.brands.find(
        b => b.brandName.toLowerCase() === updates.brandName.toLowerCase() && b.id !== brandId
      );
      if (existingBrand) {
        const error = new Error('Brand name already exists');
        error.statusCode = 409;
        throw error;
      }
    }

    const updatedBrand = {
      ...this.brands[brandIndex],
      ...updates,
      id: brandId,
      updatedAt: new Date()
    };

    this.brands[brandIndex] = updatedBrand;
    return updatedBrand;
  }

  // Eliminar marca
  delete(id) {
    const brandId = parseInt(id);

    const brandIndex = this.brands.findIndex(b => b.id === brandId);

    if (brandIndex === -1) {
      const error = new Error(`Brand with id ${brandId} does not exist`);
      error.statusCode = 404;
      throw error;
    }

    const deletedBrand = this.brands[brandIndex];
    this.brands.splice(brandIndex, 1);
    return deletedBrand;
  }
}

module.exports = BrandsService;
