import Ward from "../models/ward.model.js";

export const getWards = async (req, res) => {
  try {
    const wards = await Ward.findAll({ order: [["name", "ASC"]] });
    res.json({ data: wards });
  } catch (error) {
    console.error("❌ Error fetching wards:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getWardsByProvinceCode = async (req, res) => {
  const provinceCode = req.params.provinceCode;
  try {
    const wards = await Ward.findAll({
      where: { province_code: provinceCode },
      order: [["name", "ASC"]],
    });
    res.json({ data: wards });
  } catch (error) {
    console.error(`❌ Error fetching wards for province ${provinceCode}:`, error);
    res.status(500).json({ message: "Server error" });
  }
};
