<<<<<<< HEAD
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

=======
import Wishlist from '../models/wishlist.model.js';
import Product from '../models/product.model.js';
import ProductImage from '../models/productimage.model.js';

// Lấy danh sách wishlist của user
export const getMyWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: 'product', // alias giữa Wishlist và Product
          include: [
            {
              model: ProductImage,
              as: 'images', // alias giữa Product và ProductImage
              attributes: ['productImg'],
              separate: true,
              limit: 1,
            },
          ],
        },
      ],
    });

    const host = `${req.protocol}://${req.get('host')}`;

    const formattedWishlist = wishlist.map((item) => {
      const productData = item.product?.toJSON() || null;
      if (productData && productData.images && productData.images.length > 0) {
        productData.productImg = `${host}/${productData.images[0].productImg}`;
      } else if (productData) {
        productData.productImg = null;
      }
      delete productData?.images;

      return {
        id: item.id,
        userId: item.userId,
        product: productData,
        createdAt: item.createdAt,
      };
    });

    res.status(200).json(formattedWishlist);
  } catch (error) {
    console.error('❌ Error fetching wishlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Thêm sản phẩm vào wishlist
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    // Kiểm tra sản phẩm đã tồn tại trong wishlist chưa
    const exists = await Wishlist.findOne({ where: { userId, productId } });
    if (exists) {
      return res.status(400).json({ message: "Sản phẩm đã có trong wishlist" });
    }

    const wishlistItem = await Wishlist.create({ userId, productId });
    res.status(201).json({ message: "Đã thêm vào wishlist", wishlistItem });
  } catch (error) {
    console.error("❌ Error adding to wishlist:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Xóa sản phẩm khỏi wishlist
>>>>>>> main
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

<<<<<<< HEAD
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
=======
    const deleted = await Wishlist.destroy({ where: { userId, productId } });

    if (!deleted) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại trong wishlist" });
    }

    res.status(200).json({ message: "Đã xóa khỏi wishlist" });
  } catch (error) {
    console.error("❌ Error removing from wishlist:", error);
    res.status(500).json({ message: "Server error" });
>>>>>>> main
  }
};
