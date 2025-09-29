// models/user.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

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
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "customer",
    },
    googleId: { type: DataTypes.STRING, allowNull: true, unique: true }, // <-- thêm cột
    isNewUser: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }, // <-- thêm cột
    avatarImg: { type: DataTypes.STRING, allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    // createdAt & updatedAt sẽ tự được Sequelize quản lý khi timestamps: true
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

export default User;
