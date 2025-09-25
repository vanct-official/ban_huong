import sequelize from "../config/db.js";
import { QueryTypes } from "sequelize";

// Lấy tất cả sản phẩm
export const getAll = async (callback) => {
  const sql = `
    SELECT p.id, p.productName, p.quantity, p.unitPrice, p.description, pi.productImg
    FROM product p
    LEFT JOIN productimage pi ON p.id = pi.productId
  `;
  try {
    const results = await sequelize.query(sql, { type: QueryTypes.SELECT });
    callback(null, results);
  } catch (err) {
    callback(err, null);
  }
};

// 🔍 Tìm sản phẩm theo tên
export const searchByName = (keyword, callback) => {
  const sql = "SELECT * FROM product WHERE productName LIKE ?";
  db.query(sql, [`%${keyword}%`], callback);
};
