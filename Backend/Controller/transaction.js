import Transaction from "../Models/transaction.js";

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createTransaction = async (req, res) => {
  const transaction = req.body;
  const newTransaction = new Transaction(transaction);
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
    await Transaction.findByIdAndDelete(id);
    res.json({ message: "Transaction deleted successfully." });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
