import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Home Repair', 'Cleaning', 'Appliance', 'Maintenance']
  },
  icon: {
    type: String,
    required: true
  },
  basePrice: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;
