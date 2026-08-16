import mongoose from "mongoose";

const grnSchema = new mongoose.Schema({
  purchaseOrder: { type: mongoose.Schema.Types.ObjectId, ref: "PurchaseOrder", required: true },
  receivedProducts: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: Number
  }],
  receivedDate: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("GRN", grnSchema);
