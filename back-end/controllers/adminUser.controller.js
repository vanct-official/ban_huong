import User from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách user" });
  }
};

export const suspendUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.update({ isActive: false }, { where: { id } });
    res.json({ message: "Đình chỉ user thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi đình chỉ user" });
  }
};

export const activateUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.update({ isActive: true }, { where: { id } });
    res.json({ message: "Kích hoạt user thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi kích hoạt user" });
  }
};

export const makeAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await User.update({ role: "admin" }, { where: { id } });
    res.json({ message: "Cấp quyền admin thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cấp quyền admin" });
  }
};
