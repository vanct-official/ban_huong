import Order from "../models/order.model.js";
import OrderItem from "../models/orderItem.model.js";
import Product from "../models/product.model.js";
import ProductImage from "../models/productimage.model.js";

export const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "productName", "unitPrice"],
              include: [
                {
                  model: ProductImage,
                  as: "images",
                  attributes: ["productImg"],
                  limit: 1, // chỉ lấy 1 ảnh
                },
              ],
            },
          ],
        },
      ],
      order: [["orderDate", "DESC"]],
    });

    res.json(orders);
  } catch (err) {
    console.error("❌ Lỗi getOrderHistory:", err);
    res.status(500).json({ error: "Không thể lấy lịch sử đơn hàng" });
  }
};
