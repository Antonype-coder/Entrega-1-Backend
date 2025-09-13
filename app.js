import express from "express";
import ProductManager from "./managers/productManager.js";
import CartManager from "./managers/cartManager.js";

const app = express();
app.use(express.json());

const productManager = new ProductManager("./data/products.json");
const cartManager = new CartManager("./data/carts.json");

app.get("/", (req, res) => res.send("Servidor funcionando 🚀"));

// --------------------- PRODUCTS ---------------------
// GET all products
app.get("/api/products", async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

// GET product by ID
app.get("/api/products/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const product = await productManager.getProductById(id);
  if (!product) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(product);
});

// POST new product
app.post("/api/products", async (req, res) => {
  const newProduct = await productManager.addProduct(req.body);
  res.json({ message: "Producto agregado", product: newProduct });
});

// PUT update product
app.put("/api/products/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const updatedProduct = await productManager.updateProduct(id, req.body);
  if (!updatedProduct) return res.status(404).json({ error: "Producto no encontrado" });
  res.json({ message: "Producto actualizado", product: updatedProduct });
});

// DELETE product
app.delete("/api/products/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const deleted = await productManager.deleteProduct(id);
  if (!deleted) return res.status(404).json({ error: "Producto no encontrado" });
  res.json({ message: "Producto eliminado" });
});

// --------------------- CARTS ---------------------
// POST create cart
app.post("/api/carts", async (req, res) => {
  const cart = await cartManager.createCart();
  res.json({ message: "Carrito creado", cart });
});

// GET cart by ID
app.get("/api/carts/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const cart = await cartManager.getCartById(id);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  res.json(cart);
});

// POST add product to cart
app.post("/api/carts/:cid/product/:pid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);

  const cart = await cartManager.addProductToCart(cid, pid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  res.json({ message: "Producto agregado al carrito", cart });
});

// DELETE cart by ID
app.delete("/api/carts/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const deleted = await cartManager.deleteCart(id);
  if (!deleted) return res.status(404).json({ error: "Carrito no encontrado" });
  res.json({ message: `Carrito ${id} eliminado correctamente` });
});

// --------------------- SERVER ---------------------
app.listen(8080, () => console.log("Servidor corriendo en http://localhost:8080"));
