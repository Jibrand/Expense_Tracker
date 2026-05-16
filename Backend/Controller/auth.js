import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Models/user.js";
import Category from "../Models/category.js";

const DEFAULT_CATEGORIES = [
  { name: 'Grocery', icon: 'HiOutlineShoppingCart', color: '#4F46E5' },
  { name: 'Food', icon: 'HiOutlineFastFood', color: '#F59E0B' },
  { name: 'Salary', icon: 'HiOutlineBriefcase', color: '#10B981' },
  { name: 'Reward', icon: 'HiOutlineGift', color: '#8B5CF6' },
  { name: 'Bills', icon: 'HiOutlineDocumentText', color: '#EF4444' },
  { name: 'Transport', icon: 'HiOutlineTruck', color: '#3B82F6' },
  { name: 'Shopping', icon: 'HiOutlineTag', color: '#EC4899' },
  { name: 'Health', icon: 'HiOutlinePlusCircle', color: '#10B981' },
  { name: 'Entertainment', icon: 'HiOutlineFilm', color: '#8B5CF6' },
  { name: 'Other', icon: 'HiOutlineSparkles', color: '#64748B' },
];

// Secret will be fetched inside functions to ensure dotenv is loaded

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Seed default categories for new user
    const categoriesToSeed = DEFAULT_CATEGORIES.map(cat => ({
      ...cat,
      userId: newUser._id
    }));
    await Category.insertMany(categoriesToSeed);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { email: existingUser.email, userId: existingUser._id, role: existingUser.role },
      process.env.JWT_SECRET || "test",
      { expiresIn: "24h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Must be true for sameSite: none
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.status(200).json({ 
      user: { 
        id: existingUser._id, 
        name: existingUser.name, 
        email: existingUser.email, 
        role: existingUser.role 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
