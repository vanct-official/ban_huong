// src/pages/private/admin/UpdateProduct.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";
import { Form, Input, InputNumber, Button, message, Card } from "antd";
import { EditOutlined } from "@ant-design/icons";
import RichTextEditor from "../../../components/RichTextEditor/RichTextEditor";

const API_URL = process.env.REACT_APP_API_URL;

const UpdateProduct = () => {
  const { id } = useParams(); // lấy productId từ URL
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState("");
  const [form] = Form.useForm();

  // load dữ liệu sản phẩm khi vào trang
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products/${id}`);
        const product = res.data;

        // set vào form
        form.setFieldsValue({
          productName: product.productName,
          quantity: product.quantity,
          unitPrice: product.unitPrice,
        });

        // set description
        setDescription(product.description || "");

        // preview ảnh cũ (nếu có)
        if (product.productImgs && product.productImgs.length > 0) {
          setFiles(
            product.productImgs.map((url, index) => ({
              name: `old-${index}`,
              preview: url,
              isOld: true, // flag để biết ảnh này đã có trong DB
            }))
          );
        }
      } catch (err) {
        console.error("❌ Lỗi khi load sản phẩm:", err);
        message.error("Không thể tải dữ liệu sản phẩm");
      }
    };
    fetchProduct();
  }, [id, form]);

  // drag-drop upload
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      setFiles((prev) => [
        ...prev,
        ...acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        ),
      ]);
    },
  });

  // submit update
  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("productName", values.productName);
      formData.append("quantity", values.quantity);
      formData.append("unitPrice", values.unitPrice);
      formData.append("description", description);

      // chỉ append ảnh mới
      files.forEach((file) => {
        if (!file.isOld) {
          formData.append("images", file);
        }
      });

      await axios.put(`${API_URL}/api/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("Cập nhật sản phẩm thành công");
      navigate("/admin/products"); // chuyển về danh sách
    } catch (err) {
      console.error("❌ Lỗi khi update sản phẩm:", err);
      message.error("Cập nhật sản phẩm thất bại");
    }
  };

  return (
    <>
      <Sidebar />
      <div style={{ maxWidth: 800, margin: "20px auto" }}>
        <Card title="Cập nhật sản phẩm" bordered>
          <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <Form.Item
              label="Tên sản phẩm"
              name="productName"
              rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
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
              <Button type="primary" htmlType="submit" icon={<EditOutlined />}>
                Cập nhật sản phẩm
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default UpdateProduct;
