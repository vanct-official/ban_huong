import multer from "multer";
import path from "path";

// Nơi lưu file ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Thư mục lưu ảnh
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // tên file = timestamp + đuôi file
  },
});

const upload = multer({ storage: storage });

export default upload;
