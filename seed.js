import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
const password = await bcrypt.hash("Admin@123", 10);
await User.findOneAndUpdate(
  { email: "admin@erp.com" },
  { name: "ERP Admin", email: "admin@erp.com", password, role: "Admin" },
  { upsert: true, new: true }
);
console.log("Admin created: admin@erp.com / Admin@123");
await mongoose.disconnect();
