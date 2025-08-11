# Bắt đầu với Create React App

Dự án này được khởi tạo bằng [Create React App](https://github.com/facebook/create-react-app).

## Các lệnh có sẵn

Trong thư mục dự án, bạn có thể chạy:

### `npm start`

Chạy ứng dụng ở chế độ phát triển.
Mở [http://localhost:3000](http://localhost:3000) để xem trong trình duyệt của bạn.

Trang sẽ tự động tải lại khi bạn thay đổi mã.
Bạn cũng có thể thấy các lỗi lint trong console.

---

### `npm test`

Khởi chạy trình chạy test ở chế độ theo dõi tương tác.
Xem thêm tại [Chạy test](https://facebook.github.io/create-react-app/docs/running-tests).

---

### `npm run build`

Build ứng dụng cho môi trường production vào thư mục `build`.
Lệnh này sẽ:

* Tối ưu mã React ở chế độ production.
* Nén mã và thêm hash vào tên file để tăng hiệu suất tải.

Ứng dụng sau khi build đã sẵn sàng để triển khai.
Xem thêm tại [Triển khai](https://facebook.github.io/create-react-app/docs/deployment).

---

### `npm run eject`

**Lưu ý:** Đây là thao tác **một chiều**. Một khi đã eject thì không thể quay lại!

Lệnh này sẽ:

* Sao chép tất cả file cấu hình và dependencies liên quan (webpack, Babel, ESLint, v.v.) vào dự án của bạn.
* Cho phép bạn toàn quyền chỉnh sửa cấu hình.

Hầu hết các dự án nhỏ và vừa không cần `eject`.

---

## Tìm hiểu thêm

* [Tài liệu Create React App](https://facebook.github.io/create-react-app/docs/getting-started)
* [Tài liệu React](https://reactjs.org/)

---

## 📦 Giới thiệu các dependency

| Tên gói                               | Phiên bản | Mô tả                                                     |
| ------------------------------------- | --------- | --------------------------------------------------------- |
| **@ckeditor/ckeditor5-build-classic** | ^41.4.2   | Phiên bản build sẵn của CKEditor 5 với giao diện Classic. |
| **@ckeditor/ckeditor5-react**         | ^11.0.0   | Wrapper giúp tích hợp CKEditor 5 vào React.               |
| **@craco/craco**                      | ^7.1.0    | Tùy chỉnh cấu hình CRA mà không cần eject.                |
| **@testing-library/dom**              | ^10.4.0   | Thư viện kiểm thử thao tác DOM.                           |
| **@testing-library/jest-dom**         | ^6.6.3    | Matcher bổ sung cho Jest (như `.toBeInTheDocument()`).    |
| **@testing-library/react**            | ^16.3.0   | Công cụ test component React.                             |
| **@testing-library/user-event**       | ^13.5.0   | Mô phỏng hành vi người dùng trong test.                   |
| **antd**                              | ^5.26.6   | Thư viện UI Ant Design.                                   |
| **axios**                             | ^1.11.0   | HTTP client để gọi API.                                   |
| **lucide-react**                      | ^0.525.0  | Bộ icon SVG cho React.                                    |
| **react**                             | ^19.1.0   | Thư viện chính để xây dựng UI.                            |
| **react-dom**                         | ^19.1.0   | Render UI React vào DOM.                                  |
| **react-router-dom**                  | ^7.7.0    | Thư viện định tuyến cho React.                            |
| **react-scripts**                     | 5.0.1     | Bộ script mặc định của CRA.                               |
| **web-vitals**                        | ^2.1.4    | Đo lường hiệu suất web.                                   |

---

