import { Router } from "express";
import CartManager from "../managers/cartManager.js";

const router = Router();
const cartManager = new CartManager("./data/carts.json");

router.post("/", async (req, res) => {
  try {
    const cart = await cartManager.createCart();
    res.json({ message: "Carrito creado", cart });
  } catch (error) {
    res.status(500).json({ error: "Error al crear carrito" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const cart = await cartManager.getCartById(id);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener carrito" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    const cart = await cartManager.addProductToCart(cid, pid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json({ message: "Producto agregado al carrito", cart });
  } catch (error) {
    res.status(500).json({ error: "Error al agregar producto al carrito" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await cartManager.deleteCart(id);
    if (!deleted) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json({ message: `Carrito ${id} eliminado correctamente` });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar carrito" });
  }
});

export default router;