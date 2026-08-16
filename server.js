import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import productRoutes from "./routes/products.js";
import partyRoutes from "./routes/parties.js";
import salesRoutes from "./routes/salesOrders.js";
import purchaseRoutes from "./routes/purchaseOrders.js";
import grnRoutes from "./routes/grn.js";
import invoiceRoutes from "./routes/invoices.js";

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/", (_, res) => res.json({ message: "ERP API is running" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/parties", partyRoutes);
app.use("/api/sales-orders", salesRoutes);
app.use("/api/purchase-orders", purchaseRoutes);
app.use("/api/grn", grnRoutes);
app.use("/api/invoices", invoiceRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`ERP API running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
