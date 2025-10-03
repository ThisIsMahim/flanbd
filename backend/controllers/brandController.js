const Brand = require('../models/Brand');

// Get all brands
exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new brand
exports.createBrand = async (req, res) => {
  try {
    const { name, logo } = req.body;

    if (!logo) {
      return res.status(400).json({ message: 'Logo URL is required' });
    }

    const brand = new Brand({
      name,
      logo
    });

    await brand.save();
    res.status(201).json(brand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a brand
exports.updateBrand = async (req, res) => {
  try {
    const { name, logo } = req.body;
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    brand.name = name || brand.name;
    brand.logo = logo || brand.logo;

    await brand.save();
    res.status(200).json(brand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a brand
exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.status(200).json({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single brand
exports.getBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};