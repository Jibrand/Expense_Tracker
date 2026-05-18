import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  color: { type: String, default: "#4F46E5" },
  createdAt: { type: Date, default: Date.now },
});

const Book = mongoose.model("Book", bookSchema);
export default Book;
