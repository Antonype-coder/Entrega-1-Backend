import { promises as fs } from "fs";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find((p) => p.id === id);
  }

  async addProduct(product) {
    const { title, description, code, price, stock, category } = product;
    
    if (!title || !description || !code || !price || !stock || !category) {
      throw new Error("Faltan campos obligatorios");
    }

    const products = await this.getProducts();
    
    if (products.some(p => p.code === code)) {
      throw new Error("El código del producto ya existe");
    }

    const newProduct = {
      id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
      title,
      description,
      code,
      price: Number(price),
      status: true,
      stock: Number(stock),
      category,
      thumbnails: product.thumbnails || []
    };

    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async updateProduct(id, updatedData) {
    const products = await this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    
    delete updatedData.id;
    
    products[index] = { ...products[index], ...updatedData };
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const newProducts = products.filter((p) => p.id !== id);
    if (products.length === newProducts.length) return false;
    await fs.writeFile(this.path, JSON.stringify(newProducts, null, 2));
    return true;
  }
}