import mongoose from "mongoose";

const purchaseOrderSchema = new mongoose.Schema({
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Party", required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: Number,
    price: Number
  }],
  status: { type: String, enum: ["Pending", "Ordered", "Received", "Cancelled"], default: "Pending" },
  totalPrice: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("PurchaseOrder", purchaseOrderSchema);
