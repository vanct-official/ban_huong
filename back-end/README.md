# 📦 Backend API Server

Dự án này là **backend server** được xây dựng bằng **Node.js + Express**, phục vụ API cho ứng dụng.

## 🚀 Cấu trúc thư mục (gợi ý)

```
backend/
│── src/
│   ├── config/        # Cấu hình (DB, JWT, CORS, ...)
│   ├── controllers/   # Xử lý logic API
│   ├── middleware/    # Các middleware (auth, log, validation)
│   ├── models/        # Định nghĩa model Sequelize
│   ├── routes/        # Định nghĩa API routes
│   ├── utils/         # Hàm tiện ích
│   └── app.js         # Khởi tạo ứng dụng Express
│
├── .env               # Biến môi trường
├── package.json
└── README.md
```

## ⚙️ Cài đặt

1. Cài đặt Node.js (>= 18)
2. Clone repo và vào thư mục `backend`
3. Cài đặt dependency:

```bash
npm install
```

4. Tạo file `.env` cấu hình:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=your_database
JWT_SECRET=your_secret_key
```

5. Chạy server:

```bash
npm start
```

---

## 📦 Mô tả các dependency

| Tên gói                | Phiên bản | Mô tả                                                                      |
| ---------------------- | --------- | -------------------------------------------------------------------------- |
| **cookie-parser**      | ^1.4.7    | Parse cookie từ HTTP request, dùng để xử lý token/session.                 |
| **cors**               | ^2.8.5    | Cho phép hoặc chặn request từ domain khác (Cross-Origin Resource Sharing). |
| **dotenv**             | ^17.2.0   | Load biến môi trường từ file `.env`.                                       |
| **express**            | ^5.1.0    | Framework web mạnh mẽ cho Node.js, quản lý routing và middleware.          |
| **express-validator**  | ^7.2.1    | Xác thực và lọc dữ liệu đầu vào (input validation).                        |
| **helmet**             | ^8.1.0    | Tăng cường bảo mật HTTP headers.                                           |
| **jsonwebtoken (JWT)** | ^9.0.2    | Tạo và xác thực JSON Web Token (authentication/authorization).             |
| **morgan**             | ^1.10.1   | Middleware ghi log HTTP request ra console.                                |
| **mysql2**             | ^3.14.3   | Driver kết nối MySQL hiệu suất cao.                                        |
| **sequelize**          | ^6.37.7   | ORM cho Node.js, giúp thao tác database MySQL dễ dàng hơn.                 |

---

## 🔥 Tính năng chính (dự kiến)

* Kết nối MySQL với Sequelize
* Xác thực người dùng qua JWT
* Xử lý CORS và bảo mật HTTP với Helmet
* Middleware xác thực & ghi log request
* Validation dữ liệu với express-validator

---

