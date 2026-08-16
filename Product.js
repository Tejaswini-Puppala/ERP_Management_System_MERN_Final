import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  sku: { type: String, required: true, unique: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, default: 0, min: 0 },
  reorderLevel: { type: Number, default: 10, min: 0 }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
