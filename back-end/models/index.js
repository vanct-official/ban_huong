import Product from "./product.model.js";
import ProductImage from "./productimage.model.js";
import wishlistModel from "./wishlist.model.js";

// Định nghĩa quan hệ
Product.hasMany(ProductImage, { foreignKey: "productId", as: "images" });
ProductImage.belongsTo(Product, { foreignKey: "productId", as: "product" });

db.Wishlist = wishlistModel(sequelize, Sequelize);

export { Product, ProductImage };
