import Product from "./product.model.js";
import ProductImage from "./productimage.model.js";

import Province from "./province.model.js";
import Ward from "./ward.model.js";

import Users from "./user.model.js";
import Address from "./address.model.js";
import Wishlist from "./wishlist.model.js";

import User from "./user.model.js";
import Feedback from "./feedback.model.js";

// 1 Product có nhiều ProductImage
Product.hasMany(ProductImage, { foreignKey: "productId", as: "images" });
ProductImage.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Province ↔ Ward
Province.hasMany(Ward, {
  foreignKey: "province_code",
  sourceKey: "code",
  as: "wards",
});
Ward.belongsTo(Province, {
  foreignKey: "province_code",
  targetKey: "code",
  as: "province",
});

// Address ↔ Province
Address.belongsTo(Province, {
  foreignKey: "province_code",
  targetKey: "code",
  as: "province",
});
Province.hasMany(Address, {
  foreignKey: "province_code",
  sourceKey: "code",
  as: "addresses",
});

// Address ↔ Ward
Address.belongsTo(Ward, {
  foreignKey: "ward_code",
  targetKey: "code",
  as: "ward",
});
Ward.hasMany(Address, {
  foreignKey: "ward_code",
  sourceKey: "code",
  as: "addresses",
});

// User ↔ Address
Users.hasMany(Address, {
  foreignKey: "userId",
  sourceKey: "id",
  as: "addresses",
});
Address.belongsTo(Users, { foreignKey: "userId", targetKey: "id", as: "user" });

// User ↔ Wishlist
Users.hasMany(Wishlist, {
  foreignKey: "userId",
  sourceKey: "id",
  as: "wishlists",
});
Wishlist.belongsTo(Users, {
  foreignKey: "userId",
  targetKey: "id",
  as: "user",
});

// Wishlist ↔ Product
Product.hasMany(Wishlist, { foreignKey: "productId", as: "wishlists" });
Wishlist.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Định nghĩa quan hệ
User.hasMany(Feedback, { foreignKey: "userId" });
Feedback.belongsTo(User, { foreignKey: "userId" });

// ✅ Quan hệ Product - Feedback (sử dụng alias 'feedbacks')
Product.hasMany(Feedback, { foreignKey: "productId", as: "feedbacks" });
Feedback.belongsTo(Product, { foreignKey: "productId", as: "product" });

User.hasMany(Feedback, { foreignKey: "userId" });
Feedback.belongsTo(User, { foreignKey: "userId" });

export {
  Product,
  ProductImage,
  Province,
  Ward,
  Users,
  Address,
  User,
  Feedback,
};
