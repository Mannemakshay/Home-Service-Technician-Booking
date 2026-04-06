import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";
import Booking from "../models/bookingModel.js";
import Review from "../models/reviewModel.js";
import Service from "../models/serviceModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// Admin login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email, isActive: true });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      { 
        id: admin._id, 
        role: admin.role,
        permissions: admin.permissions 
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get dashboard analytics
export const getDashboardAnalytics = async (req, res) => {
  try {
    // Basic counts
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalRevenue = [{ total: 0 }];
    const totalServices = await Service.countDocuments({ isActive: true });

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Booking status breakdown
    const bookingStats = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Revenue by month (last 6 months)
    const revenueByMonth = [];

    // Top services
    const topServices = await Booking.aggregate([
      { $group: { _id: '$service', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Average rating
    const avgRating = await Review.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    res.json({
      stats: {
        totalUsers,
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalServices,
        avgRating: avgRating[0]?.avgRating?.toFixed(2) || 0
      },
      charts: {
        bookingStats,
        revenueByMonth,
        topServices
      },
      recentBookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users (admin)
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    
    let filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user status (admin)
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User status updated successfully",
      user
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all bookings (admin view)
export const getAllBookingsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    
    let filter = {};
    if (status) {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { service: { $regex: search, $options: 'i' } },
        { technician: { $regex: search, $options: 'i' } }
      ];
    }

    const bookings = await Booking.find(filter)
      .populate('user', 'name email')
      .populate('technician', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(filter);

    res.json({
      bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create admin
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, role, permissions } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role,
      permissions
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get system logs (basic implementation)
export const getSystemLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, type } = req.query;
    
    // This is a basic implementation - in production, you'd use proper logging
    const logs = [
      {
        timestamp: new Date(),
        type: 'info',
        message: 'User login successful',
        details: { userId: '12345' }
      },
      // Add more log entries as needed
    ];

    res.json({
      logs: logs.slice((page - 1) * limit, page * limit),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: logs.length,
        pages: Math.ceil(logs.length / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reviews (admin view)
export const getAllReviewsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('technician', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments();

    res.json({
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
