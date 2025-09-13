import express from "express";
import ProductManager from "./managers/productManager.js";
import CartManager from "./managers/cartManager.js";

const app = express();
app.use(express.json());

const productManager = new ProductManager("./data/products.json");
const cartManager = new CartManager("./data/carts.json");

app.get("/", (req, res) => res.send("Servidor funcionando 🚀"));

app.get("/api/products", async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

app.get("/api/products/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const product = await productManager.getProductById(id);
  if (!product) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(product);
});

app.post("/api/products", async (req, res) => {
  const newProduct = await productManager.addProduct(req.body);
  res.json({ message: "Producto agregado", product: newProduct });
});

app.put("/api/products/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const updatedProduct = await productManager.updateProduct(id, req.body);
  if (!updatedProduct) return res.status(404).json({ error: "Producto no encontrado" });
  res.json({ message: "Producto actualizado", product: updatedProduct });
});

app.delete("/api/products/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const deleted = await productManager.deleteProduct(id);
  if (!deleted) return res.status(404).json({ error: "Producto no encontrado" });
  res.json({ message: "Producto eliminado" });
});

app.post("/api/carts", async (req, res) => {
  const cart = await cartManager.createCart();
  res.json({ message: "Carrito creado", cart });
});

app.get("/api/carts/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const cart = await cartManager.getCartById(id);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  res.json(cart);
});

app.post("/api/carts/:cid/product/:pid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);

  const cart = await cartManager.addProductToCart(cid, pid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  res.json({ message: "Producto agregado al carrito", cart });
});

app.delete("/api/carts/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const deleted = await cartManager.deleteCart(id);
  if (!deleted) return res.status(404).json({ error: "Carrito no encontrado" });
  res.json({ message: `Carrito ${id} eliminado correctamente` });
});

app.listen(8080, () => console.log("Servidor corriendo en http://localhost:8080"));
