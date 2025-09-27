import { DataTypes } from "sequelize";
// import sequelize from "./index.js";
import User from "./user.model.js";
import Product from "./product.model.js";
import { sequelize } from "../config/db.js";

const Cart = sequelize.define(
  "Cart",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  },
  {
    tableName: "carts",
    timestamps: true,
  }
);

User.hasMany(Cart, { foreignKey: "userId" });
Cart.belongsTo(User, { foreignKey: "userId" });

Cart.belongsTo(Product, { foreignKey: "productId", as: "product" });
Product.hasMany(Cart, { foreignKey: "productId", as: "carts" });

export default Cart;
