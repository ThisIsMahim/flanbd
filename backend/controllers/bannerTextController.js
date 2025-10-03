const BannerText = require('../models/BannerText');

// Get current banner text
exports.getBannerText = async (req, res) => {
  try {
    const banner = await BannerText.findOne().sort({ updatedAt: -1 });
    if (!banner) {
      return res.status(404).json({ success: false, message: 'No banner text found' });
    }
    res.json({ success: true, bannerText: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update banner text by ID
exports.updateBannerText = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const banner = await BannerText.findByIdAndUpdate(id, { text }, { new: true });
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner text not found' });
    }
    res.json({ success: true, bannerText: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new banner text
exports.createBannerText = async (req, res) => {
  try {
    const { text } = req.body;
    const banner = new BannerText({ text });
    await banner.save();
    res.status(201).json({ success: true, bannerText: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 