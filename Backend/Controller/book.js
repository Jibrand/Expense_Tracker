import Book from "../Models/book.js";
import Transaction from "../Models/transaction.js";

export const getBooks = async (req, res) => {
  try {
    const books = await Book.find({ userId: req.user.userId });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const createBook = async (req, res) => {
  const { name, color } = req.body;
  try {
    const newBook = await Book.create({
      name,
      color,
      userId: req.user.userId
    });
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    // Delete all transactions associated with this book first
    await Transaction.deleteMany({ bookId: id, userId: req.user.userId });
    // Delete the book itself
    await Book.findOneAndDelete({ _id: id, userId: req.user.userId });
    res.status(200).json({ message: "Book and its transactions deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
