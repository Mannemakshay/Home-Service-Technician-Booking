import Review from "../models/reviewModel.js";
import Booking from "../models/bookingModel.js";

// Create review
export const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment, technician, service } = req.body;
    const userId = req.user.id || req.user.userId;

    // Check if booking exists and belongs to user if bookingId provided
    if (bookingId) {
      const booking = await Booking.findOne({ 
        _id: bookingId, 
        user: userId,
        status: 'completed' 
      });
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found or not completed" });
      }

      // Check if review already exists
      const existingReview = await Review.findOne({ 
        user: userId, 
        booking: bookingId 
      });
      
      if (existingReview) {
        return res.status(400).json({ message: "Review already exists for this booking" });
      }
    }

    const review = await Review.create({
      booking: bookingId || null,
      user: userId,
      rating,
      comment,
      technician: technician || null,
      service: service || 'General System Feedback'
    });

    res.status(201).json({
      message: "Review created successfully",
      review
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all reviews for a technician
export const getTechnicianReviews = async (req, res) => {
  try {
    const { technician } = req.params;
    const { page = 1, limit = 10, rating } = req.query;

    let filter = { technician };
    if (rating) {
      filter.rating = parseInt(rating);
    }

    const reviews = await Review.find(filter)
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(filter);

    // Calculate average rating
    const avgRating = await Review.aggregate([
      { $match: { technician } },
      { $group: { _id: null, avgRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } }
    ]);

    res.json({
      reviews,
      stats: avgRating[0] || { avgRating: 0, totalReviews: 0 },
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

// Get service reviews
export const getServiceReviews = async (req, res) => {
  try {
    const { service } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ service })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ service });

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

// Get user reviews
export const getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ user: userId })
      .populate('booking', 'service date')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ user: userId });

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

// Update review
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id || req.user.userId;

    const review = await Review.findOne({ _id: id, user: userId });
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.verified) {
      return res.status(400).json({ message: "Cannot update verified review" });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    res.json({
      message: "Review updated successfully",
      review
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user.userId;

    const review = await Review.findOne({ _id: id, user: userId });
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await Review.findByIdAndDelete(id);

    res.json({
      message: "Review deleted successfully"
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mark review as helpful
export const markReviewHelpful = async (req, res) => {
  try {
    const { id } = req.params;
    
    const review = await Review.findByIdAndUpdate(
      id,
      { $inc: { helpful: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({
      message: "Review marked as helpful",
      helpful: review.helpful
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin: Verify review
export const verifyReview = async (req, res) => {
  try {
    const { id } = req.params;
    
    const review = await Review.findByIdAndUpdate(
      id,
      { verified: true },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({
      message: "Review verified successfully",
      review
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
