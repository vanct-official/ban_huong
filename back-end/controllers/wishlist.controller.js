import db from "../models/index.js";

const Wishlist = db.Wishlist;
const Product = db.Product;

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id; // user từ middleware auth
    const { productId } = req.body;

    const [wishlist, created] = await Wishlist.findOrCreate({
      where: { userId, productId },
    });

    res.json({
      message: created
        ? "Đã thêm vào wishlist"
        : "Sản phẩm đã có trong wishlist",
      data: wishlist,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    await Wishlist.destroy({ where: { userId, productId } });
    res.json({ message: "Đã xóa khỏi wishlist" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const items = await Wishlist.findAll({
      where: { userId },
      include: [{ model: Product }],
    });

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
