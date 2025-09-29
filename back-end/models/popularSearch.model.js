import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const PopularSearch = sequelize.define(
  "PopularSearch",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    keyword: { type: DataTypes.STRING, allowNull: false, unique: true },
    count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  },
  {
    tableName: "popular_searches",
    timestamps: true,
  }
);

export default PopularSearch;
