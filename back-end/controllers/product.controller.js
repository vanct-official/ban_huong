import Product from "../models/product.model.js";
import { Op } from "sequelize";

// Lấy tất cả sản phẩm
export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (err) {
    console.error("❌ Lỗi khi lấy sản phẩm:", err.message);
    res.status(500).json({ error: "Lỗi server khi lấy sản phẩm" });
  }
};

// Tạo sản phẩm mới
export const createProduct = async (req, res) => {
  try {
    const { productName, quantity, unitPrice, description } = req.body;
    const product = await Product.create({
      productName,
      quantity,
      unitPrice,
      description,
    });
    res.json({ message: "Thêm sản phẩm thành công", productId: product.id });
  } catch (err) {
    console.error("Lỗi khi thêm sản phẩm:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Tìm kiếm sản phẩm theo tên
export const searchProducts = async (req, res) => {
  const keyword = req.query.q || "";
  try {
    const products = await Product.findAll({
      where: {
        productName: {
          [Op.like]: `%${keyword}%`,
        },
      },
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server khi tìm kiếm" });
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
