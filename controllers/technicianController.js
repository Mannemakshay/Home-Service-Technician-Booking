import Technician from "../models/technicianModel.js";

export const addTechnician = async (req, res) => {
  try {
    const technician = await Technician.create(req.body);
    res.status(201).json(technician);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTechnicians = async (req, res) => {
  try {
    const { skill, available, search } = req.query;
    let filter = {};
    
    // Filter by skill
    if (skill) {
      filter.skills = { $regex: new RegExp(`^${skill}$`, 'i') };
    }
    
    // Filter by availability
    if (available !== undefined) {
      filter.available = available === 'true';
    }
    
    // Search by name or email
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const technicians = await Technician.find(filter);
    res.json(technicians);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const registerTechnician = async (req, res) => {
  try {
    const { email } = req.body;
    
    const existingTechnician = await Technician.findOne({ email });
    if (existingTechnician) {
      return res.status(400).json({ message: "Technician with this email already exists" });
    }
    
    const technician = await Technician.create(req.body);
    res.status(201).json({ 
      message: "Technician registered successfully", 
      technician 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update technician availability when booked
export const updateTechnicianAvailability = async (req, res) => {
  try {
    const { technicianId, available } = req.body;
    
    const technician = await Technician.findByIdAndUpdate(
      technicianId,
      { available },
      { new: true }
    );
    
    res.json({
      message: "Technician availability updated successfully",
      technician
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTechnician = async (req, res) => {
  try {
    const { id } = req.params;
    const technician = await Technician.findByIdAndDelete(id);
    if (!technician) {
      return res.status(404).json({ message: "Technician not found" });
    }
    res.json({ message: "Technician deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};