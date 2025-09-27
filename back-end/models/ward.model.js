import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Ward = sequelize.define(
  "Ward",
  {
    code: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },
    name: DataTypes.STRING,
    name_en: DataTypes.STRING,
    full_name: DataTypes.STRING,
    full_name_en: DataTypes.STRING,
    code_name: DataTypes.STRING,
    province_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
        references: {
            model: 'provinces', // tên bảng provinces trong DB
            key: 'code'
        }
    },
    administrative_unit_id: DataTypes.INTEGER,
  },
  {
    tableName: "wards", // tên bảng trong DB (chữ hoa/thường phải đúng)
    timestamps: false, // bảng này không cần createdAt, updatedAt
  }
);

export default Ward;
