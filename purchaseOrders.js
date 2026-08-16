import express from "express";
import PurchaseOrder from "../models/PurchaseOrder.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (_, res, next) => {
  try { res.json(await PurchaseOrder.find().populate("supplier").populate("products.product").sort({ createdAt: -1 })); } catch (e) { next(e); }
});
router.post("/", protect, async (req, res, next) => {
  try {
    const totalPrice = (req.body.products || []).reduce((s, p) => s + Number(p.quantity || 0) * Number(p.price || 0), 0);
    const order = await PurchaseOrder.create({ ...req.body, totalPrice });
    res.status(201).json(await order.populate(["supplier", "products.product"]));
  } catch (e) { next(e); }
});
router.put("/:id", protect, async (req, res, next) => {
  try {
    const totalPrice = (req.body.products || []).reduce((s, p) => s + Number(p.quantity || 0) * Number(p.price || 0), 0);
    res.json(await PurchaseOrder.findByIdAndUpdate(req.params.id, { ...req.body, totalPrice }, { new: true }).populate(["supplier", "products.product"]));
  } catch (e) { next(e); }
});
export default router;
