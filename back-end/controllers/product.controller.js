import { Product, ProductImage, OrderItem } from "../models/index.js";
import { Op } from "sequelize";
import { fn, col } from "sequelize";
import Feedback from "../models/feedback.model.js";
// import Sequelize from "sequelize";
import { sequelize } from "../config/db.js"; // 👈 Thêm dòng này

// Lấy tất cả sản phẩm
export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: ProductImage,
          as: "images",
          attributes: ["productImg"],
          separate: true,
          limit: 1,
        },
      ],
    });

    // Build full URL cho ảnh đại diện
    const host = `${req.protocol}://${req.get("host")}`;
    const result = products.map((p) => {
      const data = p.toJSON();
      data.productImg =
        data.images && data.images.length > 0
          ? `${host}/${data.images[0].productImg}`
          : null;
      delete data.images;
      return data;
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Lỗi khi lấy sản phẩm:", err.message);
    res.status(500).json({ error: "Lỗi server khi lấy sản phẩm" });
  }
};

// Tạo sản phẩm mới
export const createProduct = async (req, res) => {
  try {
    console.log("📦 req.body:", req.body);
    console.log("📷 req.files:", req.files);

    const { productName, quantity, unitPrice, description } = req.body;

    const product = await Product.create({
      productName,
      quantity,
      unitPrice,
      description,
    });

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await ProductImage.create({
          productId: product.id,
          productImg: `uploads/${file.filename}`,
        });
      }
    }

    res.json({ message: "Thêm sản phẩm thành công", productId: product.id });
  } catch (err) {
    console.error("❌ Lỗi khi thêm sản phẩm:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Lọc nâng cao: GET /api/products?q=&sort=&minPrice=&maxPrice=&page=&limit=
export const getProductsAdvanced = async (req, res) => {
  let { q, sort, minPrice, maxPrice, page, limit } = req.query;

  q = q || "";
  sort = sort || "latest";
  minPrice = minPrice ? parseInt(minPrice) : 0;
  maxPrice = maxPrice ? parseInt(maxPrice) : 500000;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 8;
  const offset = (page - 1) * limit;

  // Build where clause
  const where = {
    productName: { [Op.like]: `%${q}%` },
    unitPrice: { [Op.between]: [minPrice, maxPrice] },
  };

  // Build order
  let order = [["createdAt", "DESC"]];
  if (sort === "priceAsc") order = [["unitPrice", "ASC"]];
  else if (sort === "priceDesc") order = [["unitPrice", "DESC"]];
  else if (sort === "nameAsc") order = [["productName", "ASC"]];
  else if (sort === "nameDesc") order = [["productName", "DESC"]];

  try {
    const { rows, count } = await Product.findAndCountAll({
      where,
      order,
      limit,
      offset,
    });
    res.status(200).json({
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    console.error("❌ Lỗi khi lấy sản phẩm:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Lấy chi tiết sản phẩm theo ID (có kèm ảnh nếu có)
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id, {
      include: [
        {
          model: ProductImage,
          as: "images", // tên alias phải đúng với association
          attributes: ["id", "productImg"],
        },
      ],
    });

    if (product) {
      // Convert sang JSON để xử lý
      const productData = product.toJSON();

      // Lấy host để build full URL
      const host = `${req.protocol}://${req.get("host")}`;

      // Map ra mảng ảnh có URL đầy đủ
      productData.productImgs = productData.images?.map(
        (img) => `${host}/${img.productImg}`
      );

      // Xóa field images gốc
      delete productData.images;

      res.status(200).json(productData);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    console.error("❌ Lỗi khi lấy sản phẩm:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const q = req.query.q || "";
    const products = await Product.findAll({
      where: {
        productName: { [Op.like]: `%${q}%` },
      },
      include: [
        {
          model: ProductImage,
          as: "images",
          attributes: ["productImg"],
          separate: true,
          limit: 1,
        },
      ],
    });

    const host = `${req.protocol}://${req.get("host")}`;

    const formattedProducts = products.map((p) => {
      const prod = p.toJSON();

      // ✅ Lấy ảnh đầu tiên từ images
      if (prod.images && prod.images.length > 0) {
        prod.productImg = `${host}/${prod.images[0].productImg}`;
      } else {
        prod.productImg = null;
      }

      delete prod.images;
      return prod;
    });

    res.json(formattedProducts);
  } catch (err) {
    console.error("❌ Error searchProducts:", err);
    res.status(500).json({ message: err.message });
  }
};
// Cập nhật sản phẩm theo ID
export const updateProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Tìm sản phẩm theo ID
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { productName, quantity, unitPrice, description } = req.body;

    // Update thông tin sản phẩm
    await product.update({
      productName,
      quantity,
      unitPrice,
      description,
    });

    // Nếu có ảnh mới upload thì thêm vào bảng ProductImage
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await ProductImage.create({
          productId: product.id,
          productImg: `uploads/${file.filename}`,
        });
      }
    }

    res.json({ message: "Cập nhật sản phẩm thành công", product });
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật sản phẩm:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Xoá sản phẩm theo ID
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Tìm sản phẩm theo ID
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Xoá ảnh liên quan (nếu có bảng ProductImage)
    await ProductImage.destroy({ where: { productId: id } });

    // Xoá sản phẩm
    await product.destroy();

    res.json({ message: "Xoá sản phẩm thành công" });
  } catch (err) {
    console.error("❌ Lỗi khi xoá sản phẩm:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ✅ Lấy tất cả sản phẩm kèm rating trung bình và ảnh đại diện
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: [
        "id",
        "productName",
        "unitPrice",
        [sequelize.fn("AVG", sequelize.col("feedbacks.rate")), "avgRating"],
        [sequelize.fn("COUNT", sequelize.col("feedbacks.id")), "feedbackCount"],
      ],
      include: [
        {
          model: Feedback,
          as: "feedbacks",
          attributes: [],
        },
        {
          model: ProductImage,
          as: "images",
          attributes: ["productImg"],
          limit: 1,
        },
      ],
      group: ["Product.id"],
      subQuery: false,
    });

    const formatted = products.map((p) => {
      const data = p.get({ plain: true });
      return {
        ...data,
        avgRating: parseFloat(data.avgRating) || 0,
        feedbackCount: parseInt(data.feedbackCount) || 0,
        productImg:
          data.images && data.images.length > 0
            ? data.images[0].productImg
            : null,
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error("❌ Lỗi getAllProducts:", err);
    res.status(500).json({ error: "Không thể lấy sản phẩm" });
  }
};

export const getTopRatedProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: [
        "id",
        "productName",
        "unitPrice",
        [sequelize.fn("AVG", sequelize.col("feedbacks.rate")), "avgRating"],
        [sequelize.fn("COUNT", sequelize.col("feedbacks.id")), "feedbackCount"],
      ],
      include: [
        {
          model: Feedback,
          as: "feedbacks", // alias phải khớp với association
          attributes: [],
        },
        {
          model: ProductImage,
          as: "images",
          attributes: ["productImg"],
          limit: 1, // chỉ lấy 1 ảnh đại diện
        },
      ],
      group: ["Product.id"],
      order: [[sequelize.literal("avgRating"), "DESC"]],
      limit: 5,
      subQuery: false,
    });

    // Build full URL cho ảnh
    const host = `${req.protocol}://${req.get("host")}`;
    const result = products.map((p) => {
      const data = p.toJSON();
      data.productImg =
        data.images && data.images.length > 0
          ? `${host}/${data.images[0].productImg}`
          : "/default-product.png";
      delete data.images; // bỏ field images cho gọn JSON
      return data;
    });

    res.json(result);
  } catch (error) {
    console.error("❌ Lỗi getTopRatedProducts:", error);
    res.status(500).json({ error: "Không thể lấy sản phẩm top rating" });
  }
};

export const getBestSellers = async (req, res) => {
  try {
    const bestSellers = await Product.findAll({
      attributes: [
        "id",
        "productName",
        "unitPrice",
        [
          sequelize.fn("SUM", sequelize.col("orderItems.quantity")),
          "totalSold",
        ],
      ],
      include: [
        {
          model: OrderItem,
          as: "orderItems", // alias phải khớp với association trong index.js
          attributes: [],
        },
        {
          model: ProductImage,
          as: "images",
          attributes: ["productImg"],
          limit: 1,
        },
      ],
      group: ["Product.id"],
      order: [[sequelize.literal("totalSold"), "DESC"]],
      limit: 5,
      subQuery: false,
    });

    // Build full URL cho ảnh
    const host = `${req.protocol}://${req.get("host")}`;
    const result = bestSellers.map((p) => {
      const data = p.toJSON();
      data.productImg =
        data.images && data.images.length > 0
          ? `${host}/${data.images[0].productImg}`
          : "/default-product.png";
      delete data.images;
      return data;
    });

    res.json(result);
  } catch (err) {
    console.error("❌ Lỗi getBestSellers:", err);
    res.status(500).json({ message: "Lỗi khi lấy sản phẩm bán chạy" });
  }
};
