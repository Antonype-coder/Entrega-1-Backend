import express from "express";
import { engine } from "express-handlebars";
import { createServer } from "http";
import { Server } from "socket.io";
import ProductManager from "./src/managers/productManager.js";
import productsRouter from "./src/routes/products.router.js";
import cartsRouter from "./src/routes/carts.router.js";
import viewsRouter from "./src/routes/views.router.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const productManager = new ProductManager("./data/products.json");

app.engine("handlebars", engine({
  defaultLayout: "main",
  layoutsDir: "./views/layouts"
}));
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  socket.on("createProduct", async (productData) => {
    try {
      const newProduct = await productManager.addProduct(productData);
      io.emit("productAdded", newProduct);
    } catch (error) {
      socket.emit("error", { message: "Error al crear producto: " + error.message });
    }
  });

  socket.on("deleteProduct", async (productId) => {
    try {
      const deleted = await productManager.deleteProduct(parseInt(productId));
      if (deleted) {
        io.emit("productDeleted", parseInt(productId));
      } else {
        socket.emit("error", { message: "Producto no encontrado" });
      }
    } catch (error) {
      socket.emit("error", { message: "Error al eliminar producto" });
    }
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

httpServer.listen(8080, () => {
  console.log("Servidor corriendo en http://localhost:8080");
});