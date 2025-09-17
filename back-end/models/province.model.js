// models/province.model.js
import { DataTypes } from "sequelize";
import {sequelize} from "../config/db.js";

const Province = sequelize.define(
  "Province",
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
    administrative_unit_id: DataTypes.INTEGER,
  },
  {
    tableName: "provinces",
    timestamps: false, // không có createdAt, updatedAt
  }
);

export default Province;
