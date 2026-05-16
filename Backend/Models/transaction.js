import mongoose from "mongoose";

const transactionSchema = mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  remark: { type: String },
  category: { type: String, required: true },
  categoryIcon: { type: String },
  amount: { type: Number, required: true },
  cashIn: { type: Number, default: 0 },
  cashOut: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  mode: { type: String, default: "Cash" },
  entryBy: { type: String, default: "Jibran" },
  contact: { type: String, default: "" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
