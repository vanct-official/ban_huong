import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Address = sequelize.define(
  "Address",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // tên bảng users trong DB
          key: 'id'
        }
    },
    province_code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
          model: 'provinces', // tên bảng provinces trong DB
          key: 'code'
        }
    },
    ward_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      references: {
        model: 'wards', // tên bảng ward trong DB
        key: 'code'
      }
    },
    street: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    isDefault: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    note: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "address", // tên bảng trong DB (chữ hoa/thường phải đúng)
    timestamps: true, // Sequelize sẽ tự map createdAt, updatedAt
  }
);

export default Address;
