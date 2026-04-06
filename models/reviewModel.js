import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.Mixed,
    ref: 'Booking',
    required: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  technician: {
    type: mongoose.Schema.Types.Mixed,
    ref: 'Technician',
    required: false
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 500
  },
  service: {
    type: mongoose.Schema.Types.Mixed,
    ref: 'Service',
    required: false
  },
  verified: {
    type: Boolean,
    default: false
  },
  helpful: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
reviewSchema.index({ technician: 1, rating: -1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
