import mongoose from "mongoose";
import Service from "./models/serviceModel.js";
import dotenv from "dotenv";

dotenv.config();

const seedServices = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/home-service");
    
    const services = [
      {
        name: "Electrician",
        description: "Fix wiring and electrical issues",
        category: "Home Repair",
        icon: "⚡",
        basePrice: 300
      },
      {
        name: "Plumber",
        description: "Repair pipes and leaks",
        category: "Home Repair",
        icon: "🔧",
        basePrice: 250
      },
      {
        name: "AC Repair",
        description: "AC servicing and installation",
        category: "Appliance",
        icon: "❄️",
        basePrice: 400
      },
      {
        name: "Home Cleaning",
        description: "Complete home cleaning",
        category: "Cleaning",
        icon: "🧹",
        basePrice: 200
      },
      {
        name: "Painting",
        description: "Wall painting services",
        category: "Home Repair",
        icon: "🎨",
        basePrice: 350
      },
      {
        name: "Carpentry",
        description: "Furniture and wood work",
        category: "Home Repair",
        icon: "🔨",
        basePrice: 450
      }
    ];

    await Service.deleteMany({});
    await Service.insertMany(services);
    
    console.log("Services seeded successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding services:", error);
  }
};

seedServices();
