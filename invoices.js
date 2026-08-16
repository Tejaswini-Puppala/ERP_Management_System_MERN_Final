import express from "express";
import Invoice from "../models/Invoice.js";
import SalesOrder from "../models/SalesOrder.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// GET ALL INVOICES
router.get("/", protect, async (req, res, next) => {
  try {
    const invoices = await Invoice.find()
      .populate({
        path: "salesOrder",
        populate: {
          path: "customer",
        },
      })
      .sort({ createdAt: -1 });

    res.json(invoices);
  } catch (error) {
    next(error);
  }
});

// CREATE INVOICE
router.post("/", protect, async (req, res, next) => {
  try {
    const order = await SalesOrder.findById(
      req.body.salesOrder
    );

    if (!order) {
      return res.status(404).json({
        message: "Sales order not found",
      });
    }

    const invoice = await Invoice.create({
      salesOrder: order._id,
      amount: order.totalPrice,
      invoiceNumber: `INV-${Date.now()}`,
    });

    const populatedInvoice =
      await invoice.populate({
        path: "salesOrder",
        populate: {
          path: "customer",
        },
      });

    res.status(201).json(
      populatedInvoice
    );
  } catch (error) {
    next(error);
  }
});

// DELETE INVOICE BY INVOICE NUMBER
router.delete(
  "/number/:invoiceNumber",
  protect,
  async (req, res, next) => {
    try {
      const invoice =
        await Invoice.findOneAndDelete({
          invoiceNumber:
            req.params.invoiceNumber,
        });

      if (!invoice) {
        return res.status(404).json({
          message: "Invoice not found",
        });
      }

      res.json({
        message:
          "Invoice deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

