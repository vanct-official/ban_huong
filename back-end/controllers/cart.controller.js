import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import ProductImage from "../models/productimage.model.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Bạn cần đăng nhập" });

    let cartItem = await Cart.findOne({ where: { userId, productId } });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({ userId, productId, quantity });
    }

    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// export const getCart = async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     if (!userId) return res.status(401).json({ message: "Bạn cần đăng nhập" });

//     const items = await Cart.findAll({
//       where: { userId },
//       include: [
//         {
//           model: Product,
//           as: "product", // nhớ alias trùng với model
//           attributes: ["id", "productName", "unitPrice"],
//           include: [
//             {
//               model: ProductImage,
//               as: "images",
//               attributes: ["productImg"],
//               separate: true,
//               limit: 1, // chỉ lấy 1 ảnh đầu tiên
//             },
//           ],
//         },
//       ],
//     });

//     res.json(items);
//   } catch (err) {
//     console.error("❌ Lỗi getCart:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await Cart.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: "product", // alias giữa Cart và Product
          include: [
            {
              model: ProductImage,
              as: "images", // alias giữa Product và ProductImage
              attributes: ["productImg"],
              separate: true,
              limit: 1,
            },
          ],
        },
      ],
    });

    const host = `${req.protocol}://${req.get("host")}`;

    const formattedCart = cartItems.map((item) => {
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
        productId: item.productId,
        quantity: item.quantity,
        product: productData,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });

    res.status(200).json(formattedCart);
  } catch (error) {
    console.error("❌ Error fetching cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Bạn cần đăng nhập" });

    await Cart.destroy({ where: { userId, productId } });
    res.json({ message: "Đã xóa sản phẩm khỏi giỏ hàng" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
