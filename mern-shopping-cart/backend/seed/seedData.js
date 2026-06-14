import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

dotenv.config();
await connectDB();

const runSeed = async () => {
  try {
    await Cart.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    await User.create([
      { name: "Admin", email: "admin@example.com", password: "123456", role: "admin" },
      { name: "User", email: "user@example.com", password: "123456", role: "user" },
    ]);

    const categories = await Category.insertMany([
      { name: "Vegetables", description: "Fresh vegetables" },
      { name: "Fruits", description: "Fresh fruits" },
      { name: "Cakes", description: "Sweet cakes" },
      { name: "Biscuits", description: "Crunchy biscuits" },
    ]);

    const findCat = (name) => categories.find((cat) => cat.name === name)._id;

    await Product.insertMany([
      { name: "Carrot", description: "Fresh orange carrots", price: 180, stock: 40, image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=800", category: findCat("Vegetables") },
      { name: "Tomato", description: "Red juicy tomatoes", price: 220, stock: 35, image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=800", category: findCat("Vegetables") },
      { name: "Apple", description: "Sweet red apples", price: 140, stock: 50, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800", category: findCat("Fruits") },
      { name: "Banana", description: "Fresh ripe bananas", price: 90, stock: 70, image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800", category: findCat("Fruits") },
      { name: "Chocolate Cake", description: "Soft chocolate cake", price: 1850, stock: 12, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800", category: findCat("Cakes") },
      { name: "Cup Cake", description: "Small creamy cupcake", price: 280, stock: 25, image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800", category: findCat("Cakes") },
      { name: "Cream Biscuits", description: "Vanilla cream biscuits", price: 250, stock: 60, image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800", category: findCat("Biscuits") },
      { name: "Chocolate Cookies", description: "Chocolate chip cookies", price: 450, stock: 45, image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800", category: findCat("Biscuits") },
    ]);

    console.log("Seed data inserted successfully");
    process.exit();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

runSeed();
