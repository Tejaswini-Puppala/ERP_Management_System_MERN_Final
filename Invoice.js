import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  salesOrder: { type: mongoose.Schema.Types.ObjectId, ref: "SalesOrder", required: true },
  invoiceNumber: { type: String, unique: true },
  amount: Number,
  status: { type: String, enum: ["Generated", "Paid", "Cancelled"], default: "Generated" }
}, { timestamps: true });

export default mongoose.model("Invoice", invoiceSchema);
