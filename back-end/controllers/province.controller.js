const Provinces = require('../models/province.model');

exports.getProvinces = async (req, res) => {
  try {
    const provinces = await Provinces.findAll();
    res.json(provinces);
  } catch (error) {
    console.error("❌ Error fetching provinces:", error);
    res.status(500).json({ message: "Server error" });
  }
}