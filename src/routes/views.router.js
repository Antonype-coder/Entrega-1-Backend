import { Router } from "express";
import ProductManager from "../managers/productManager.js";

const router = Router();
const productManager = new ProductManager("./data/products.json");

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("home", { 
      products,
      layout: "main"
    });
  } catch (error) {
    res.status(500).send("Error al cargar los productos");
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", { 
      products,
      layout: "main"
    });
  } catch (error) {
    res.status(500).send("Error al cargar los productos");
  }
});

export default router;