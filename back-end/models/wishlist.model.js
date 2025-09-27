<<<<<<< HEAD
export default (sequelize, DataTypes) => {
  const Wishlist = sequelize.define("Wishlist", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Wishlist.associate = (models) => {
    Wishlist.belongsTo(models.User, { foreignKey: "userId" });
    Wishlist.belongsTo(models.Product, { foreignKey: "productId" });
  };

  return Wishlist;
};
=======
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Wishlist = sequelize.define(
  "Wishlist",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
        references: {
            model: 'users', // tên bảng provinces trong DB
            key: 'id'
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'product', // tên bảng provinces trong DB
            key: 'id'
        }
    }
  },
  {
    tableName: "wishlists", // tên bảng trong DB (chữ hoa/thường phải đúng)
    timestamps: false, // bảng này không cần createdAt, updatedAt
  }
);

export default Wishlist;
>>>>>>> main
