import mongoose from "mongoose";
import dotenv from "dotenv";

const cleanBookings = async () => {
    await mongoose.connect("mongodb://localhost:27017/home-service");
    
    // Delete anything that causes populate cast errors
    // We can just wipe all bookings to be safe since this is just dev data
    const res = await mongoose.connection.db.collection('bookings').deleteMany({});
    
    console.log("Deleted bookings:", res);
    process.exit(0);
};

cleanBookings();
