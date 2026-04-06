import Booking from "../models/bookingModel.js";
import Technician from "../models/technicianModel.js";
import mongoose from "mongoose";

// Create new booking
export const createBooking = async (req, res) => {
  try {
    const { user, service, technician, date, time, address, price } = req.body;
    
    // Validate required fields
    if (!user || !service || !technician || !date || !time || !address) {
      return res.status(400).json({ message: "Missing required fields: user, service, technician, date, time, address are required" });
    }
    
    // Handle technician ObjectId conversion
    let technicianId = technician;
    if (typeof technician === 'string' && mongoose.Types.ObjectId.isValid(technician)) {
      technicianId = new mongoose.Types.ObjectId(technician);
    }
    
    // For now, allow service as string (will be fixed when services are properly seeded)
    const bookingData = {
      user,
      service: service, // Temporarily allow string
      technician: technicianId,
      date: new Date(date),
      time,
      address,
      price: price || 200 // Default price if not provided
    };
    
    const booking = await Booking.create(bookingData);

    // Update technician availability to not available when booked
    try {
      // Only update if technician is a valid ObjectId
      if (mongoose.Types.ObjectId.isValid(technician)) {
        await Technician.findByIdAndUpdate(
          technician,
          { available: false },
          { new: true }
        );
      }
    } catch (error) {
      console.error("Error updating technician availability:", error);
    }
    
    res.status(201).json({
      message: "Booking created successfully",
      booking
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all bookings for a user
export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ user: userId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings (for admin/technicians)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('user', 'name email');
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    res.json({
      message: "Booking status updated successfully",
      booking
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: 'cancelled' },
      { new: true }
    ).populate('user', 'name email');
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    res.json({
      message: "Booking cancelled successfully",
      booking
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findById(id)
      .populate('user', 'name email');
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
