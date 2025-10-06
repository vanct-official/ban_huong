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
    googleId: { type: DataTypes.STRING, allowNull: true, unique: true },
    isNewUser: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    avatarImg: { type: DataTypes.STRING, allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },

    // 👇 Thêm trường password
    password: { type: DataTypes.STRING, allowNull: true },
    resetPasswordToken: { type: DataTypes.STRING, allowNull: true },
    resetPasswordExpires: { type: DataTypes.DATE, allowNull: true },
    email_verification_token: { type: DataTypes.STRING, allowNull: true },
    email_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

export default User;
