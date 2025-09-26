import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const ProductImage = sequelize.define(
  "ProductImage",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Product", // tên bảng mà nó tham chiếu
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    productImg: {
      type: DataTypes.STRING(255), // hoặc TEXT nếu muốn lưu path dài
      allowNull: false,
    },
  },
  {
    tableName: "productimage",
    timestamps: false, // bảng này không cần createdAt, updatedAt
  }
);

export default ProductImage;
