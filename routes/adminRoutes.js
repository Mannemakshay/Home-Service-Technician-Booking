import express from "express";
import { 
  adminLogin, 
  getDashboardAnalytics, 
  getAllUsers, 
  updateUserStatus, 
  getAllBookingsAdmin, 
  getAllReviewsAdmin
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin login
router.post("/login", adminLogin);

// Dashboard analytics
router.get("/dashboard", protect, getDashboardAnalytics);

// User management
router.get("/users", protect, getAllUsers);
router.put("/users/:id/status", protect, updateUserStatus);

// Booking management
router.get("/bookings", protect, getAllBookingsAdmin);

// Reviews management
router.get("/reviews", protect, getAllReviewsAdmin);

export default router;
