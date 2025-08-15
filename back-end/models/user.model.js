const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    firstname: { type: DataTypes.STRING, allowNull: false },
    middlename: { type: DataTypes.STRING, allowNull: true },
    lastname: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING, allowNull: true, unique: true },
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: "customer" },
    avatarImg: { type: DataTypes.STRING, allowNull: true },
    // Không cần khai báo createdAt, updatedAt nếu dùng timestamps: true
  },
  {
    tableName: "users",
    timestamps: true, // Sequelize tự động quản lý
  }
);

module.exports = User;
