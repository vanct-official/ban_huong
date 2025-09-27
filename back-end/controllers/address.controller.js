import Address from "../models/address.model.js";
import Users from "../models/user.model.js";
import Wards from "../models/ward.model.js";
import Provinces from "../models/province.model.js";

// Lấy địa chỉ của user theo id
export const getAddressesByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const addresses = await Address.findAll({
      where: { userId },
      include: [
        { model: Provinces, as: "province", attributes: ["full_name"] },
        { model: Wards, as: "ward", attributes: ["full_name"] },
      ],
    });

    const formattedAddresses = addresses.map((addr) => ({
      id: addr.id,
      userId: addr.userId,
      province: addr.province ? addr.province.full_name : null,
      ward: addr.ward ? addr.ward.full_name : null,
      street: addr.street,
      isDefault: addr.isDefault,
      note: addr.note,
    }));
    res.status(200).json(formattedAddresses);
  } catch (error) {
    console.error("❌ Error fetching addresses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Lấy địa chỉ của user đang đăng nhập (token)
export const getMyAddresses = async (req, res) => {
  try {
    console.log(">>> req.user:", req.user); // debug
    const userId = req.user.id;
    const addresses = await Address.findAll({
      where: { userId },
      include: [
        { model: Provinces, as: "province", attributes: ["full_name"] },
        { model: Wards, as: "ward", attributes: ["full_name"] },
      ],
    });
    const formattedAddresses = addresses.map((addr) => ({
      id: addr.id,
      userId: addr.userId,
      province: addr.province ? addr.province.full_name : null,
      ward: addr.ward ? addr.ward.full_name : null,
      street: addr.street,
      isDefault: addr.isDefault,
      note: addr.note,
    }));
    res.status(200).json(formattedAddresses);
  } catch (error) {
    console.error("❌ Error fetching my addresses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Thêm địa chỉ mới cho user đang đăng nhập
export const createAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { province_code, ward_code, street, note } = req.body; // ward_code đúng tên model

    const address = await Address.create({
      userId,
      province_code,  // dùng đúng tên field
      ward_code,      // dùng đúng tên field
      street,
      note,
      isDefault: false,
    });

    res.status(201).json(address);
  } catch (error) {
    console.error("❌ Error creating address:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Xóa địa chỉ theo id
export const deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const address = await Address.findByPk(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    await address.destroy();
    res.status(200).json({ message: "Address deleted" });
  } catch (error) {
    console.error("❌ Error deleting address:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Đặt địa chỉ mặc định
export const setDefaultAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const address = await Address.findByPk(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    // Bỏ mặc định các địa chỉ khác của user
    await Address.update(
      { isDefault: false },
      { where: { userId: address.userId } }
    );
    // Đặt mặc định cho địa chỉ này
    address.isDefault = true;
    await address.save();
    res.status(200).json({ message: "Set as default address" });
  } catch (error) {
    console.error("❌ Error setting default address:", error);
    res.status(500).json({ message: "Server error" });
  }
};
