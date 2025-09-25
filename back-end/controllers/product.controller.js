import { getAll, searchByName } from "../models/product.model.js";

// Controller: Lấy tất cả sản phẩm
export const getProducts = (req, res) => {
  getAll((err, products) => {
    if (err) {
      console.error("❌ Lỗi khi lấy sản phẩm:", err.message);
      return res.status(500).json({ error: "Lỗi server khi lấy sản phẩm" });
    }
    res.status(200).json(products);
  });
};

export const createProduct = (req, res) => {
  const { productName, quantity, unitPrice, description } = req.body;
  const imgPath = req.file ? `/uploads/${req.file.filename}` : null;

  // Thêm sản phẩm
  const sqlProduct =
    "INSERT INTO product (productName, quantity, unitPrice, description) VALUES (?, ?, ?, ?)";
  db.query(
    sqlProduct,
    [productName, quantity, unitPrice, description],
    (err, result) => {
      if (err) {
        console.error("Lỗi khi thêm sản phẩm:", err);
        return res.status(500).json({ message: "Lỗi server" });
      }

      const productId = result.insertId;

      if (imgPath) {
        const sqlImg =
          "INSERT INTO productimage (productId, productImg) VALUES (?, ?)";
        db.query(sqlImg, [productId, imgPath], (err) => {
          if (err) console.error("Lỗi khi thêm ảnh:", err);
        });
      }

      res.json({ message: "Thêm sản phẩm thành công", productId });
    }
  );
};

// 🔍 Tìm kiếm sản phẩm
export const searchProducts = (req, res) => {
  const keyword = req.query.q || "";
  searchByName(keyword, (err, products) => {
    if (err) return res.status(500).json({ error: "Lỗi server khi tìm kiếm" });
    res.status(200).json(products);
  });
};

// GET /api/products?q=&sort=&minPrice=&maxPrice=&page=&limit=
export const getProductsAdvanced = (req, res) => {
  let { q, sort, minPrice, maxPrice, page, limit } = req.query;

  q = q || "";
  sort = sort || "latest";
  minPrice = minPrice ? parseInt(minPrice) : 0;
  maxPrice = maxPrice ? parseInt(maxPrice) : 1000000000; // giá trần
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 8;
  const offset = (page - 1) * limit;

  // Câu lệnh SQL cơ bản
  let sql = `
    SELECT SQL_CALC_FOUND_ROWS *
    FROM product
    WHERE productName LIKE ? AND unitPrice BETWEEN ? AND ?
  `;

  // Sort
  if (sort === "priceAsc") {
    sql += " ORDER BY unitPrice ASC";
  } else if (sort === "priceDesc") {
    sql += " ORDER BY unitPrice DESC";
  } else if (sort === "nameAsc") {
    sql += " ORDER BY productName ASC";
  } else if (sort === "nameDesc") {
    sql += " ORDER BY productName DESC";
  } else {
    sql += " ORDER BY createdAt DESC"; // mặc định mới nhất
  }

  // Phân trang
  sql += " LIMIT ? OFFSET ?";

  db.query(
    sql,
    [`%${q}%`, minPrice, maxPrice, limit, offset],
    (err, results) => {
      if (err) {
        console.error("❌ Lỗi khi lấy sản phẩm:", err);
        return res.status(500).json({ error: "Lỗi server" });
      }

      // Lấy tổng số sản phẩm để phân trang
      db.query("SELECT FOUND_ROWS() AS total", (err2, rows) => {
        if (err2) {
          return res.status(500).json({ error: "Lỗi đếm sản phẩm" });
        }
        const total = rows[0].total;
        res.status(200).json({
          data: results,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        });
      });
    }
  );
};
