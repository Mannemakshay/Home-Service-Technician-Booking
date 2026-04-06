import mongoose from "mongoose";

const technicianSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    phone: { type: String, required: true },
    skills: [{ type: String, required: true }],
    available: { type: Boolean, default: true },
    experience: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 }
  },
  { timestamps: true }
);

export default mongoose.model("Technician", technicianSchema);