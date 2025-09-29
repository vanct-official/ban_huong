import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Post = sequelize.define(
  "Post",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    thumbnail: { type: DataTypes.STRING, allowNull: true },
    author: { type: DataTypes.STRING, defaultValue: "Admin" },
  },
  {
    tableName: "posts",
    timestamps: true,
  }
);

export default Post;
