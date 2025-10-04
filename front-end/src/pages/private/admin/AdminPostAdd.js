import React, { useState } from "react";
import { Form, Input, Button, Upload, Card, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../../../components/Sidebar";
import RichTextEditor from "../../../components/RichTextEditor/RichTextEditor";

const API_URL = process.env.REACT_APP_API_URL;

export default function AdminPostAdd() {
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", content); // Lấy từ RichTextEditor
      formData.append("author", values.author || "Admin");

      if (fileList[0]) {
        formData.append("thumbnail", fileList[0].originFileObj);
      }

      await axios.post(`${API_URL}/api/admin/posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      message.success("✅ Thêm bài viết thành công");
      navigate("/admin/posts");
    } catch (err) {
      console.error("❌ Lỗi thêm bài viết:", err);
      message.error("Không thể thêm bài viết");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: 24 }}>
        <Card
          title="➕ Thêm bài viết mới"
          style={{ maxWidth: 900, margin: "0 auto" }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ author: "Admin" }}
          >
            <Form.Item
              name="title"
              label="Tiêu đề"
              rules={[{ required: true, message: "Nhập tiêu đề" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Nội dung"
              required
              rules={[{ validator: () => (content ? Promise.resolve() : Promise.reject("Nhập nội dung")) }]}
            >
              <RichTextEditor value={content} onChange={setContent} />
            </Form.Item>

            <Form.Item name="author" label="Tác giả">
              <Input placeholder="Mặc định: Admin" />
            </Form.Item>

            <Form.Item label="Ảnh thumbnail">
              <Upload
                listType="picture"
                fileList={fileList}
                beforeUpload={() => false}
                onChange={({ fileList }) => setFileList(fileList)}
              >
                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Lưu
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}
