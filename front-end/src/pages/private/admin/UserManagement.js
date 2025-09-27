import React, { useEffect, useState } from "react";
import { Table, Button, Avatar, message, Space, Tag, Drawer } from "antd";
import { ReloadOutlined, MenuOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import AdminSidebar from "../../../components/Sidebar";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  // Responsive check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi tải danh sách người dùng!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Toggle active/inactive user
  const handleToggleActive = async (id, currentActive) => {
    try {
      await axios.patch(`http://localhost:5000/api/users/${id}`, {
        active: !currentActive,
      });
      message.success(
        `Người dùng đã được ${currentActive ? "vô hiệu hóa" : "kích hoạt"}!`
      );
      fetchUsers();
    } catch (err) {
      console.error(err);
      message.error("Thay đổi trạng thái thất bại!");
    }
  };

  const columns = [
    {
      title: "Avatar",
      key: "avatar",
      render: (record) => {
        const img = record.avatar || record.avatarImg || record.picture || null;

        return img ? (
          <Avatar
            src={
              img.startsWith("http") ? img : `http://localhost:5000/${img}` // Nếu chỉ là đường dẫn file thì thêm host
            }
            size={40}
          />
        ) : (
          <Avatar icon={<UserOutlined />} size={40} />
        );
      },
      width: 80,
      align: "center",
    },

    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text) => <span style={{ fontWeight: 600 }}>{text}</span>,
      width: 180,
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <span style={{ color: "#555" }}>{text}</span>,
      width: 220,
      ellipsis: true,
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "admin" ? "red" : "green"}>
          {role === "admin" ? "Quản trị" : "Người dùng"}
        </Tag>
      ),
      width: 120,
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      render: (active) =>
        active ? (
          <Tag color="green">Hoạt động</Tag>
        ) : (
          <Tag color="volcano">Vô hiệu hóa</Tag>
        ),
      width: 120,
      align: "center",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type={record.active ? "default" : "primary"}
            danger={record.active} // nếu đang active thì nút sẽ màu đỏ
            size="small"
            onClick={() => handleToggleActive(record.id, record.active)}
          >
            {record.active ? "Ban" : "Hoạt động"}
          </Button>
        </Space>
      ),
      width: 160,
      align: "center",
    },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f6f8fa" }}>
      {/* Sidebar */}
      {!isMobile && (
        <div
          style={{
            minWidth: 220,
            background: "#fff",
            borderRight: "1px solid #eee",
          }}
        >
          <AdminSidebar collapsed={false} />
        </div>
      )}

      {/* Drawer sidebar for mobile */}
      {isMobile && (
        <Drawer
          placement="left"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          bodyStyle={{ padding: 0 }}
          width={220}
        >
          <AdminSidebar collapsed={false} />
        </Drawer>
      )}

      {/* Main content */}
      <div
        style={{
          flex: 1,
          padding: isMobile ? 8 : 24,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: isMobile ? 12 : 24,
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {isMobile && (
              <Button
                icon={<MenuOutlined />}
                onClick={() => setSidebarOpen(true)}
                style={{ borderRadius: 8, marginRight: 8 }}
              />
            )}
            <h2
              style={{
                margin: 0,
                color: "#166534",
                fontSize: isMobile ? 20 : 26,
              }}
            >
              Quản lý người dùng
            </h2>
          </div>
        </div>

        {/* Table */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 4px 24px rgba(22,101,52,0.08)",
            padding: isMobile ? 4 : 24,
          }}
        >
          <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: isMobile ? 5 : 10 }}
            bordered
            scroll={{ x: 700 }}
            size={isMobile ? "small" : "middle"}
          />
        </div>
      </div>
    </div>
  );
}
