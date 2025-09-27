import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Feedback = sequelize.define(
  "Feedback",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    feedbackContent: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "feedback",
    timestamps: true, // 👈 bắt buộc để Sequelize tự sinh createdAt, updatedAt
  }
);

export default Feedback;
