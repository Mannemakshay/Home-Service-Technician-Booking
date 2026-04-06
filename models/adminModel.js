import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'moderator'],
    default: 'admin'
  },
  permissions: {
    type: [String],
    enum: [
      'manage_users',
      'manage_technicians',
      'manage_services',
      'manage_bookings',
      'manage_payments',
      'manage_reviews',
      'view_analytics',
      'manage_admins'
    ],
    default: ['view_analytics']
  },
  lastLogin: {
    type: Date
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

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
