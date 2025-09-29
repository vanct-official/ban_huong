import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";
import { Form, Input, InputNumber, Button, message, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import RichTextEditor from "../../../components/RichTextEditor/RichTextEditor";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

const AddProduct = () => {
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false); // ✅ trạng thái loading
  const navigate = useNavigate();

  // drag-drop upload
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        )
      );
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true); // ✅ bật loading
    try {
      const formData = new FormData();
      formData.append("productName", values.productName);
      formData.append("quantity", values.quantity);
      formData.append("unitPrice", values.unitPrice);
      formData.append("description", description);

      files.forEach((file) => {
        formData.append("images", file);
      });

      const res = await axios.post(`${API_URL}/api/products`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success(res.data.message || "Thêm sản phẩm thành công");

      // ✅ delay nhẹ để message hiển thị rồi mới chuyển trang
      setTimeout(() => {
        navigate("/admin/products");
      }, 800);
    } catch (err) {
      console.error("❌ Lỗi thêm sản phẩm:", err);
      message.error("Thêm sản phẩm thất bại");
    } finally {
      setLoading(false); // ✅ tắt loading
    }
  };

  return (
    <>
      <Sidebar />
      <div style={{ maxWidth: 800, margin: "20px auto" }}>
        <Card title="Thêm sản phẩm mới" bordered>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Tên sản phẩm"
              name="productName"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm" },
              ]}
            >
              <Input placeholder="Nhập tên sản phẩm" />
            </Form.Item>

            <Form.Item
              label="Số lượng"
              name="quantity"
              rules={[{ required: true, message: "Nhập số lượng" }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Giá"
              name="unitPrice"
              rules={[{ required: true, message: "Nhập giá sản phẩm" }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
              />
            </Form.Item>

            <Form.Item label="Mô tả">
              <RichTextEditor value={description} onChange={setDescription} />
            </Form.Item>

            <Form.Item label="Hình ảnh">
              <div
                {...getRootProps()}
                style={{
                  border: "2px dashed #aaa",
                  borderRadius: "8px",
                  padding: "20px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: isDragActive ? "#fafafa" : "#fff",
                }}
              >
                <input {...getInputProps()} />
                <p style={{ margin: 0 }}>
                  {isDragActive
                    ? "Thả ảnh vào đây..."
                    : "Kéo & thả ảnh hoặc click để chọn"}
                </p>
              </div>

              {/* preview ảnh */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginTop: 15,
                }}
              >
                {files.map((file) => (
                  <img
                    key={file.name}
                    src={file.preview}
                    alt="preview"
                    width={100}
                    style={{
                      borderRadius: 8,
                      objectFit: "cover",
                      border: "1px solid #eee",
                    }}
                  />
                ))}
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<PlusOutlined />}
                loading={loading} // ✅ hiển thị loading
              >
                {loading ? "Đang thêm..." : "Thêm sản phẩm"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default AddProduct;
