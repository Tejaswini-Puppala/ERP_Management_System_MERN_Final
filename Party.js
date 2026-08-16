import mongoose from "mongoose";

const partySchema = new mongoose.Schema({
  type: { type: String, enum: ["Customer", "Supplier"], required: true },
  name: { type: String, required: true },
  contact: String,
  address: String
}, { timestamps: true });

export default mongoose.model("Party", partySchema);
