import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { protect, allow } from "../middleware/auth.js";

const router = express.Router();

// Get currently logged-in user
router.get("/me", protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (e) {
    next(e);
  }
});

// Get all users - Admin only
router.get("/", protect, allow("Admin"), async (req, res, next) => {
  try {
    const users = await User.find().select("-password");

    res.json({ users });
  } catch (e) {
    next(e);
  }
});

// Update user - Admin only
router.put("/:id", protect, allow("Admin"), async (req, res, next) => {
  try {
    const data = { ...req.body };

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (e) {
    next(e);
  }
});

// Delete user - Admin only
router.delete("/:id", protect, allow("Admin"), async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted" });
  } catch (e) {
    next(e);
  }
});

export default router;