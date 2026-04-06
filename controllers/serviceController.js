import Service from "../models/serviceModel.js";

// Create new service
export const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({
      message: "Service created successfully",
      service
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all services
export const getAllServices = async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = { isActive: true };
    
    // Filter by category
    if (category) {
      filter.category = category;
    }
    
    // Search by name or description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const services = await Service.find(filter).sort({ name: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get service by ID
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const service = await Service.findById(id);
    
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update service
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    
    const service = await Service.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    
    res.json({
      message: "Service updated successfully",
      service
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete service (soft delete - set isActive to false)
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    
    const service = await Service.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    
    res.json({
      message: "Service deleted successfully",
      service
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get services by category
export const getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const services = await Service.find({ 
      category, 
      isActive: true 
    }).sort({ name: 1 });
    
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Service.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
