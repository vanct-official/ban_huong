import Subscriber from "../models/subscriber.model.js";

export const createSubscriber = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email là bắt buộc" });

    const existing = await Subscriber.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    await Subscriber.create({ email });

    // ✅ Trả về thông báo thân thiện
    res.status(201).json({
      message: "Cảm ơn bạn đã quan tâm",
    });
  } catch (err) {
    console.error("❌ Lỗi createSubscriber:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ✅ Thêm lại export này
export const getSubscribers = async (req, res) => {
  try {
    const subs = await Subscriber.findAll({ order: [["createdAt", "DESC"]] });
    res.json(subs);
  } catch (err) {
    console.error("❌ Lỗi getSubscribers:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    const sub = await Subscriber.findByPk(id);
    if (!sub)
      return res.status(404).json({ message: "Không tìm thấy subscriber" });

    await sub.destroy();
    res.json({ message: "Xóa subscriber thành công" });
  } catch (err) {
    console.error("❌ Lỗi deleteSubscriber:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
