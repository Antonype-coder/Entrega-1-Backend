import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import exphbs from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import ProductManager from "./managers/productManager.js";
import viewsRouter from "./routes/viewsRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const productManager = new ProductManager("./data/products.json");

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", viewsRouter);

app.post("/api/products", async (req, res) => {
  const newProduct = await productManager.addProduct(req.body);
  const products = await productManager.getProducts();
  io.emit("productsUpdated", products);
  res.json({ message: "Producto agregado", product: newProduct });
});

app.delete("/api/products/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const deleted = await productManager.deleteProduct(id);
  const products = await productManager.getProducts();
  io.emit("productsUpdated", products);
  res.json({ message: "Producto eliminado" });
});

io.on("connection", async (socket) => {
  console.log("Cliente conectado");
  const products = await productManager.getProducts();
  socket.emit("productsUpdated", products);
  
  socket.on("createProduct", async (productData) => {
    await productManager.addProduct(productData);
    const updatedProducts = await productManager.getProducts();
    io.emit("productsUpdated", updatedProducts);
  });

  socket.on("deleteProduct", async (productId) => {
    await productManager.deleteProduct(parseInt(productId));
    const updatedProducts = await productManager.getProducts();
    io.emit("productsUpdated", updatedProducts);
  });
});

httpServer.listen(8080, () => {
  console.log("Servidor corriendo en http://localhost:8080");
});