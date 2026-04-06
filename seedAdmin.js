import mongoose from "mongoose";
import Admin from "./models/adminModel.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/home-service");
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: "admin@easyfix.com" });
    if (existingAdmin) {
      console.log("Admin account already exists!");
      mongoose.connection.close();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await Admin.create({
      name: "Super Admin",
      email: "admin@easyfix.com",
      password: hashedPassword,
      role: "super_admin",
      permissions: [
        'manage_users',
        'manage_technicians',
        'manage_services',
        'manage_bookings',
        'manage_payments',
        'manage_reviews',
        'view_analytics',
        'manage_admins'
      ]
    });
    
    console.log("Admin account created successfully!");
    console.log("Email: admin@easyfix.com");
    console.log("Password: admin123");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
};

seedAdmin();
