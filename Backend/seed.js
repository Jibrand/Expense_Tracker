import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './Models/user.js';
import Book from './Models/book.js';
import Category from './Models/category.js';
import Transaction from './Models/transaction.js';

dotenv.config();

const CONNECTION_URL = process.env.CONNECTION_URL;

const categories = [
  { name: 'Grocery', icon: 'HiOutlineShoppingCart', color: '#4F46E5' },
  { name: 'Food', icon: 'HiOutlineFastFood', color: '#F59E0B' },
  { name: 'Salary', icon: 'HiOutlineBriefcase', color: '#10B981' },
  { name: 'Rent', icon: 'HiOutlineHome', color: '#EF4444' },
  { name: 'Bills', icon: 'HiOutlineDocumentText', color: '#EC4899' },
  { name: 'Transport', icon: 'HiOutlineTruck', color: '#3B82F6' },
  { name: 'Entertainment', icon: 'HiOutlineFilm', color: '#8B5CF6' },
  { name: 'Health', icon: 'HiOutlinePlusCircle', color: '#10B981' },
  { name: 'Shopping', icon: 'HiOutlineTag', color: '#F43F5E' },
  { name: 'Other', icon: 'HiOutlineSparkles', color: '#64748B' },
];

const seed = async () => {
  try {
    await mongoose.connect(CONNECTION_URL);
    console.log('Connected to MongoDB');

    // 1. Create Demo User
    const existingUser = await User.findOne({ email: 'demo@example.com' });
    if (existingUser) {
      console.log('Cleaning up existing demo user...');
      await Transaction.deleteMany({ userId: existingUser._id });
      await Category.deleteMany({ userId: existingUser._id });
      await Book.deleteMany({ userId: existingUser._id });
      await User.deleteOne({ _id: existingUser._id });
    }

    const hashedPassword = await bcrypt.hash('demo123', 12);
    const user = await User.create({
      name: 'Demo User',
      email: 'demo@example.com',
      password: hashedPassword,
    });
    console.log('User created: demo@example.com / demo123');

    // 2. Create Categories
    const createdCategories = await Category.insertMany(
      categories.map(cat => ({ ...cat, userId: user._id }))
    );
    console.log('10 Categories created');

    // 3. Create 3 Books
    const bookNames = ['Personal Finances', 'Business Ledger', 'Travel Expenses'];
    const createdBooks = await Book.insertMany(
      bookNames.map(name => ({ name, userId: user._id }))
    );
    console.log('3 Books created');

    // 4. Create 50 Transactions per book
    const transactions = [];
    const now = new Date();

    for (const book of createdBooks) {
      let balance = 0;
      for (let i = 0; i < 50; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - (50 - i)); // Spread over last 50 days
        
        const type = Math.random() > 0.3 ? 'expense' : 'income';
        const amount = type === 'income' 
          ? Math.floor(Math.random() * 5000) + 1000 
          : Math.floor(Math.random() * 500) + 50;
        
        const cashIn = type === 'income' ? amount : 0;
        const cashOut = type === 'expense' ? amount : 0;
        balance += (cashIn - cashOut);

        const category = createdCategories[Math.floor(Math.random() * createdCategories.length)];

        transactions.push({
          userId: user._id,
          bookId: book._id,
          date: date.toISOString().split('T')[0],
          time: '12:00',
          remark: `${type === 'income' ? 'Received' : 'Paid for'} ${category.name} item ${i+1}`,
          category: category.name,
          categoryIcon: category.icon,
          amount: amount,
          cashIn,
          cashOut,
          balance,
          entryBy: 'Demo User'
        });
      }
    }

    await Transaction.insertMany(transactions);
    console.log('150 Transactions created (50 per book)');

    console.log('Seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
