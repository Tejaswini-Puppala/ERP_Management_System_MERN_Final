import mongoose from "mongoose";

const salesOrderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Party", required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: Number,
    price: Number
  }],
  status: { type: String, enum: ["Pending", "Confirmed", "Completed", "Cancelled"], default: "Pending" },
  totalPrice: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("SalesOrder", salesOrderSchema);
