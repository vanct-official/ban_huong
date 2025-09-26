import Product from "./product.model.js";
import ProductImage from "./productimage.model.js";

// Định nghĩa quan hệ
Product.hasMany(ProductImage, { foreignKey: "productId", as: "images" });
ProductImage.belongsTo(Product, { foreignKey: "productId", as: "product" });

export { Product, ProductImage };
