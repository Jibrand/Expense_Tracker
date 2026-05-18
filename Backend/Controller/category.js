import Category from "../Models/category.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user.userId });
    res.status(200).json(categories);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  const category = req.body;
  const newCategory = new Category({ ...category, userId: req.user.userId });
  try {
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, icon, color } = req.body;
  try {
    const updatedCategory = await Category.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { name, icon, color },
      { new: true }
    );
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await Category.findOneAndDelete({ _id: id, userId: req.user.userId });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
