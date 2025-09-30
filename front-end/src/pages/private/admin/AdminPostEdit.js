import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload, Card, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../../../components/Sidebar";

const API_URL = process.env.REACT_APP_API_URL;

export default function AdminPostEdit() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load dữ liệu bài viết cũ
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/admin/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const post = res.data;
        form.setFieldsValue({
          title: post.title,
          content: post.content,
          author: post.author,
        });

        if (post.image) {
          setFileList([
            {
              uid: "-1",
              name: "thumbnail.jpg",
              status: "done",
              url: post.image,
            },
          ]);
        }
      } catch (err) {
        console.error("❌ Lỗi load post:", err);
        message.error("Không thể tải bài viết");
      }
    };
    fetchPost();
  }, [id, form]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", values.content);
      formData.append("author", values.author || "Admin");

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("thumbnail", fileList[0].originFileObj);
      }

      await axios.put(`${API_URL}/api/admin/posts/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      message.success("✅ Cập nhật bài viết thành công");
      navigate("/admin/posts");
    } catch (err) {
      console.error("❌ Lỗi update:", err);
      message.error("Không thể cập nhật bài viết");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: 24 }}>
        <Card
          title="✏️ Sửa bài viết"
          style={{ maxWidth: 900, margin: "0 auto" }}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="title"
              label="Tiêu đề"
              rules={[{ required: true, message: "Nhập tiêu đề" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="content"
              label="Nội dung"
              rules={[{ required: true, message: "Nhập nội dung" }]}
            >
              <Input.TextArea rows={8} />
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
