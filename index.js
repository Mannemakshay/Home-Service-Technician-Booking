import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./config/db.js";

// Routes
import userRoutes from "./routes/userRoutes.js";
import technicianRoutes from "./routes/technicianRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
dotenv.config();

const app = express();
// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

// Database Connection
dbConnect();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/technicians", technicianRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Server Start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});