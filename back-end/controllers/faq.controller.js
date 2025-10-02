import Faq from "../models/faq.model.js";
import User from "../models/user.model.js";

// ✅ Lấy danh sách FAQ đã duyệt (hiển thị cho user)
export const getFaqs = async (req, res) => {
  try {
    const faqs = await Faq.findAll({
      where: { isApproved: true },
      include: [
        { model: User, as: "user", attributes: ["id", "username", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(faqs);
  } catch (err) {
    console.error("❌ Lỗi getFaqs:", err);
    res.status(500).json({ error: "Không thể lấy danh sách FAQ" });
  }
};

// ✅ Admin xem tất cả FAQ (chưa duyệt + đã duyệt)
export const getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.findAll({
      include: [
        { model: User, as: "user", attributes: ["id", "username", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(faqs);
  } catch (err) {
    console.error("❌ Lỗi getAllFaqs:", err);
    res.status(500).json({ error: "Không thể lấy tất cả FAQ" });
  }
};

// Người dùng đặt câu hỏi
export const askFaq = async (req, res) => {
  try {
    const { question, userId } = req.body; // userId có thể null nếu khách vãng lai

    const faq = await Faq.create({
      question,
      userId: userId || null,
      isApproved: false, // mặc định chưa duyệt
    });

    res.status(201).json(faq);
  } catch (err) {
    console.error("❌ Lỗi askFaq:", err);
    res.status(500).json({ error: "Không thể gửi câu hỏi" });
  }
};

// Admin duyệt câu hỏi
export const approveFaq = async (req, res) => {
  try {
    const { id } = req.params;
    await Faq.update({ isApproved: true }, { where: { id } });
    res.json({ message: "Câu hỏi đã được duyệt" });
  } catch (err) {
    console.error("❌ Lỗi approveFaq:", err);
    res.status(500).json({ error: "Không thể duyệt câu hỏi" });
  }
};

// Admin trả lời câu hỏi
export const answerFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;
    await Faq.update({ answer }, { where: { id } });
    res.json({ message: "Đã trả lời câu hỏi" });
  } catch (err) {
    console.error("❌ Lỗi answerFaq:", err);
    res.status(500).json({ error: "Không thể trả lời câu hỏi" });
  }
};

export const getApprovedFaqs = async (req, res) => {
  try {
    const faqs = await Faq.findAll({
      where: { isApproved: true },
      order: [["updatedAt", "DESC"]],
      limit: 2, // chỉ lấy 2 câu mới nhất
    });
    res.json(faqs);
  } catch (err) {
    console.error("❌ Lỗi getApprovedFaqs:", err);
    res.status(500).json({ error: "Không thể tải FAQ" });
  }
};
