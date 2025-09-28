import Promotion from "../models/promotion.model.js";

// Lấy tất cả khuyến mãi
export const getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(promotions);
  } catch (err) {
    console.error("❌ Lỗi getAllPromotions:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Lấy 1 khuyến mãi theo id
export const getPromotionById = async (req, res) => {
  try {
    const promo = await Promotion.findByPk(req.params.id);
    if (!promo) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(promo);
  } catch (err) {
    console.error("❌ Lỗi getPromotionById:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Thêm mới
export const createPromotion = async (req, res) => {
  try {
    const { promotionName, description, discountPercent } = req.body;
    const promo = await Promotion.create({
      promotionName,
      description,
      discountPercent,
    });
    res.status(201).json(promo);
  } catch (err) {
    console.error("❌ Lỗi createPromotion:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Cập nhật
export const updatePromotion = async (req, res) => {
  try {
    const promo = await Promotion.findByPk(req.params.id);
    if (!promo) return res.status(404).json({ message: "Không tìm thấy" });

    const { promotionName, description, discountPercent } = req.body;
    await promo.update({ promotionName, description, discountPercent });

    res.json(promo);
  } catch (err) {
    console.error("❌ Lỗi updatePromotion:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Xóa
export const deletePromotion = async (req, res) => {
  try {
    const promo = await Promotion.findByPk(req.params.id);
    if (!promo) return res.status(404).json({ message: "Không tìm thấy" });

    await promo.destroy();
    res.json({ message: "Đã xóa thành công" });
  } catch (err) {
    console.error("❌ Lỗi deletePromotion:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
