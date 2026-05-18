import Transaction from "../Models/transaction.js";

export const getTransactions = async (req, res) => {
  const { bookId } = req.query;
  try {
    if (!bookId) return res.status(400).json({ message: "bookId is required" });
    const transactions = await Transaction.find({ userId: req.user.userId, bookId }).sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createTransaction = async (req, res) => {
  const transaction = req.body;
  if (!transaction.bookId) return res.status(400).json({ message: "bookId is required" });
  const newTransaction = new Transaction({ ...transaction, userId: req.user.userId });
  try {
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    await Transaction.findOneAndDelete({ _id: id, userId: req.user.userId });
    res.json({ message: "Transaction deleted successfully." });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const transaction = req.body;
  try {
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { ...transaction },
      { new: true }
    );
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
