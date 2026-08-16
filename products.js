import express from "express";
import Product from "../models/Product.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const search = req.query.search || "";
    const filter = search ? { $or: [{ title: new RegExp(search, "i") }, { sku: new RegExp(search, "i") }] } : {};
    const total = await Product.countDocuments(filter);
    const items = await Product.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (e) { next(e); }
});

router.post("/", protect, async (req, res, next) => {
  try { res.status(201).json(await Product.create(req.body)); } catch (e) { next(e); }
});
router.put("/:id", protect, async (req, res, next) => {
  try { res.json(await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })); } catch (e) { next(e); }
});
router.delete("/:id", protect, async (req, res, next) => {
  try { await Product.findByIdAndDelete(req.params.id); res.json({ message: "Product deleted" }); } catch (e) { next(e); }
});

export default router;
