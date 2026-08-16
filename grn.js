import express from "express";
import GRN from "../models/GRN.js";
import Product from "../models/Product.js";
import PurchaseOrder from "../models/PurchaseOrder.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (_, res, next) => {
  try { res.json(await GRN.find().populate("purchaseOrder").populate("receivedProducts.product").sort({ createdAt: -1 })); } catch (e) { next(e); }
});

router.post("/", protect, async (req, res, next) => {
  try {
    const grn = await GRN.create(req.body);
    for (const item of req.body.receivedProducts || []) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: Number(item.quantity || 0) } });
    }
    await PurchaseOrder.findByIdAndUpdate(req.body.purchaseOrder, { status: "Received" });
    res.status(201).json(await grn.populate(["purchaseOrder", "receivedProducts.product"]));
  } catch (e) { next(e); }
});
export default router;
