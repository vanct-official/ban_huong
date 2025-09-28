import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Promotion = sequelize.define(
  "Promotion",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    promotionName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    discountPercent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: { min: 0, max: 100 },
    },
  },
  {
    tableName: "promotion",
    timestamps: true, // createdAt, updatedAt
  }
);

export default Promotion;
