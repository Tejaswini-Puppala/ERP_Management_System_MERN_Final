import express from "express";
import SalesOrder from "../models/SalesOrder.js";
import { protect } from "../middleware/auth.js";
import mongoose from "mongoose";

const router = express.Router();

// GET SALES ORDERS
router.get("/", protect, async (_, res, next) => {
  try {
    const orders = await SalesOrder.find()
      .populate("customer")
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (e) {
    next(e);
  }
});

// CREATE SALES ORDER
router.post("/", protect, async (req, res, next) => {
  try {
    if (!req.body.customer) {
      return res.status(400).json({
        message: "Customer is required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        req.body.customer
      )
    ) {
      return res.status(400).json({
        message: "Invalid customer ID",
      });
    }

    if (
      !req.body.products ||
      !Array.isArray(req.body.products) ||
      req.body.products.length === 0
    ) {
      return res.status(400).json({
        message: "At least one product is required",
      });
    }

    const totalPrice = req.body.products.reduce(
      (sum, p) =>
        sum +
        Number(p.quantity || 0) *
          Number(p.price || 0),
      0
    );

    const order = await SalesOrder.create({
      ...req.body,
      totalPrice,
    });

    const populatedOrder =
      await order.populate([
        "customer",
        "products.product",
      ]);

    res.status(201).json(populatedOrder);
  } catch (e) {
    next(e);
  }
});

// UPDATE SALES ORDER / STATUS
router.put("/:id", protect, async (req, res, next) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    if (req.body.customer) {
      if (
        !mongoose.Types.ObjectId.isValid(
          req.body.customer
        )
      ) {
        return res.status(400).json({
          message: "Invalid customer ID",
        });
      }
    }

    if (req.body.products) {
      for (const item of req.body.products) {
        if (
          !item.product ||
          !mongoose.Types.ObjectId.isValid(
            item.product
          )
        ) {
          return res.status(400).json({
            message: "Invalid product ID",
          });
        }
      }
    }

    const updateData = {
      ...req.body,
    };

    if (req.body.products) {
      updateData.totalPrice =
        req.body.products.reduce(
          (sum, p) =>
            sum +
            Number(p.quantity || 0) *
              Number(p.price || 0),
          0
        );
    }

    const updatedOrder =
      await SalesOrder.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate("customer")
        .populate("products.product");

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Sales order not found",
      });
    }

    res.json(updatedOrder);
  } catch (e) {
    next(e);
  }
});

// DELETE SALES ORDER
router.delete(
  "/:id",
  protect,
  async (req, res, next) => {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          message: "Invalid order ID",
        });
      }

      const deletedOrder =
        await SalesOrder.findByIdAndDelete(
          req.params.id
        );

      if (!deletedOrder) {
        return res.status(404).json({
          message: "Sales order not found",
        });
      }

      res.json({
        message:
          "Sales order deleted successfully",
      });
    } catch (e) {
      next(e);
    }
  }
);

export default router;
