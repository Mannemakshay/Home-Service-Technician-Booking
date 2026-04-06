import express from "express";
import { 
  createService, 
  getAllServices, 
  getServiceById, 
  updateService, 
  deleteService, 
  getServicesByCategory, 
  getAllCategories 
} from "../controllers/serviceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create service (admin route)
router.post("/", protect, createService);

// Get all services with optional filtering
router.get("/", getAllServices);

// Get all categories
router.get("/categories", getAllCategories);

// Get services by category
router.get("/category/:category", getServicesByCategory);

// Get service by ID
router.get("/:id", getServiceById);

// Update service (admin route)
router.put("/:id", protect, updateService);

// Delete service (admin route)
router.delete("/:id", protect, deleteService);

export default router;
