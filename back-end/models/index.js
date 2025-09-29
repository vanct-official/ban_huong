// models/index.js
import Product from "./product.model.js";
import ProductImage from "./productimage.model.js";

import Province from "./province.model.js";
import Ward from "./ward.model.js";

import User from "./user.model.js";
import Address from "./address.model.js";
import Wishlist from "./wishlist.model.js";
import Feedback from "./feedback.model.js";
import Order from "./order.model.js";
import OrderItem from "./orderItem.model.js";

// =======================
// Product ↔ ProductImage
// =======================
Product.hasMany(ProductImage, { foreignKey: "productId", as: "images" });
ProductImage.belongsTo(Product, { foreignKey: "productId", as: "product" });

// =======================
// Province ↔ Ward
// =======================
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

// =======================
// Address ↔ Province
// =======================
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

// =======================
// Address ↔ Ward
// =======================
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

// =======================
// User ↔ Address
// =======================
User.hasMany(Address, {
  foreignKey: "userId",
  sourceKey: "id",
  as: "addresses",
});
Address.belongsTo(User, { foreignKey: "userId", targetKey: "id", as: "user" });

// =======================
// User ↔ Wishlist
// =======================
User.hasMany(Wishlist, {
  foreignKey: "userId",
  sourceKey: "id",
  as: "wishlists",
});
Wishlist.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "id",
  as: "user",
});

// Wishlist ↔ Product
Product.hasMany(Wishlist, { foreignKey: "productId", as: "wishlists" });
Wishlist.belongsTo(Product, { foreignKey: "productId", as: "product" });

// =======================
// Product ↔ Feedback
// =======================
Product.hasMany(Feedback, { foreignKey: "productId", as: "feedbacks" });
Feedback.belongsTo(Product, { foreignKey: "productId", as: "product" });

User.hasMany(Feedback, { foreignKey: "userId", as: "feedbacks" });
Feedback.belongsTo(User, { foreignKey: "userId", as: "user" });

// =======================
// Order ↔ OrderItem ↔ Product
// =======================
Order.hasMany(OrderItem, { as: "items", foreignKey: "orderId" });
OrderItem.belongsTo(Order, { as: "order", foreignKey: "orderId" });

Product.hasMany(OrderItem, { as: "orderItems", foreignKey: "productId" });
OrderItem.belongsTo(Product, { as: "product", foreignKey: "productId" });

// =======================
// Export all models
// =======================
export {
  Product,
  ProductImage,
  Province,
  Ward,
  User,
  Address,
  Wishlist,
  Feedback,
  Order,
  OrderItem,
};
