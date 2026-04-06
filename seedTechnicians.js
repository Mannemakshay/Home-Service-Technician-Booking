import mongoose from "mongoose";
import Technician from "./models/technicianModel.js";
import dotenv from "dotenv";

dotenv.config();

const seedTechnicians = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/home-service");
    
    const technicians = [
      {
        name: "Ravi Kumar",
        email: "ravi.kumar@easyfix.com",
        phone: "+91-9876543210",
        skills: ["Electrician", "Appliance Repair", "Home Automation"],
        available: true,
        experience: 5,
        rating: 4.5
      },
      {
        name: "Suresh Reddy",
        email: "suresh.reddy@easyfix.com", 
        phone: "+91-9876543211",
        skills: ["Plumber", "Pipe Fitting", "Leak Detection", "Bathroom Installation"],
        available: true,
        experience: 3,
        rating: 4.2
      },
      {
        name: "Mahesh Patel",
        email: "mahesh.patel@easyfix.com",
        phone: "+91-9876543212", 
        skills: ["AC Repair", "AC Installation", "Refrigerator Service"],
        available: true,
        experience: 6,
        rating: 4.8
      },
      {
        name: "Arjun Sharma",
        email: "arjun.sharma@easyfix.com",
        phone: "+91-9876543213",
        skills: ["Painting", "Interior Painting", "Exterior Painting", "Wall Preparation"],
        available: true,
        experience: 4,
        rating: 4.6
      },
      {
        name: "Kiran Verma",
        email: "kiran.verma@easyfix.com",
        phone: "+91-9876543214",
        skills: ["Carpentry", "Furniture Assembly", "Wood Polishing", "Custom Carpentry"],
        available: true,
        experience: 3,
        rating: 4.3
      },
      {
        name: "Vikram Singh",
        email: "vikram.singh@easyfix.com",
        phone: "+91-9876543215",
        skills: ["Electrician", "Electrical Panel Installation", "Generator Service", "UPS Installation"],
        available: true,
        experience: 7,
        rating: 4.7
      },
      {
        name: "Neha Sharma",
        email: "neha.sharma@easyfix.com",
        phone: "+91-9876543216",
        skills: ["Home Cleaning", "Deep Cleaning", "Sanitization"],
        available: true,
        experience: 5,
        rating: 4.9
      }
    ];

    await Technician.deleteMany({});
    await Technician.insertMany(technicians);
    
    console.log("Technicians seeded successfully!");
    console.log(`Seeded ${technicians.length} technicians`);
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding technicians:", error);
  }
};

seedTechnicians();
