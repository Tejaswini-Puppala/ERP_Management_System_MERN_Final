import express from "express";
import Party from "../models/Party.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res, next) => {
  try {
    const type = req.query.type;
    const search = req.query.search || "";
    const filter = {
      ...(type ? { type } : {}),
      ...(search ? { name: new RegExp(search, "i") } : {})
    };
    res.json(await Party.find(filter).sort({ createdAt: -1 }));
  } catch (e) { next(e); }
});
router.post("/", protect, async (req, res, next) => {
  try { res.status(201).json(await Party.create(req.body)); } catch (e) { next(e); }
});
router.put("/:id", protect, async (req, res, next) => {
  try { res.json(await Party.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })); } catch (e) { next(e); }
});
router.delete("/:id", protect, async (req, res, next) => {
  try { await Party.findByIdAndDelete(req.params.id); res.json({ message: "Party deleted" }); } catch (e) { next(e); }
});
export default router;
