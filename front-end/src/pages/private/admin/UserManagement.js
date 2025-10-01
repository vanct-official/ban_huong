import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Avatar,
  message,
  Space,
  Tag,
  Drawer,
  Modal,
  Radio,
} from "antd";
import { ReloadOutlined, MenuOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import AdminSidebar from "../../../components/Sidebar";

const API_URL = process.env.REACT_APP_API_URL;

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [actionType, setActionType] = useState("");

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi tải danh sách user");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAction = async () => {
    if (!selectedUser || !actionType) return;
    const urlMap = {
      suspend: `${API_URL}/api/admin/users/${selectedUser.id}/suspend`,
      activate: `${API_URL}/api/admin/users/${selectedUser.id}/activate`,
      "make-admin": `${API_URL}/api/admin/users/${selectedUser.id}/make-admin`,
    };
    try {
      await axios.put(
        urlMap[actionType],
        {},
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      message.success("Thao tác thành công!");
      setModalVisible(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      message.error("Thao tác thất bại!");
    }
  };

  const showActionModal = (user) => {
    setSelectedUser(user);
    setActionType(""); // reset
    setModalVisible(true);
  };

  const columns = [
    {
      title: "Avatar",
      key: "avatar",
      render: (record) => {
        const img = record.avatar || record.avatarImg || record.picture || null;
        return img ? (
          <Avatar
            src={img.startsWith("http") ? img : `${API_URL}/uploads/${img}`}
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
      render: (text) => <strong>{text}</strong>,
      width: 180,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <span style={{ color: "#555" }}>{text}</span>,
      width: 220,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "admin" ? "red" : "green"}>
          {role === "admin" ? "Admin" : "User"}
        </Tag>
      ),
      width: 120,
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (active) =>
        active ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="volcano">Disabled</Tag>
        ),
      width: 120,
      align: "center",
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => {
        if (record.role === "admin") return null;
        return (
          <Button
            type="primary"
            size="small"
            onClick={() => showActionModal(record)}
          >
            Hành động
          </Button>
        );
      },
      width: 150,
      align: "center",
    },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f6f8fa" }}>
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

      <div
        style={{
          flex: 1,
          padding: isMobile ? 8 : 24,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
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
              👤 Quản lý người dùng
            </h2>
          </div>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchUsers}
            loading={loading}
          >
            Làm mới
          </Button>
        </div>

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

        {/* Modal chọn hành động */}
        <Modal
          title={`Hành động cho "${selectedUser?.username}"`}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={handleAction}
          okText="Xác nhận"
          cancelText="Hủy"
        >
          <Radio.Group
            onChange={(e) => setActionType(e.target.value)}
            value={actionType}
          >
            {selectedUser?.isActive && <Radio value="suspend">Đình chỉ</Radio>}
            {!selectedUser?.isActive && (
              <Radio value="activate">Kích hoạt</Radio>
            )}
            {selectedUser?.role !== "admin" && (
              <Radio value="make-admin">Cấp quyền Admin</Radio>
            )}
          </Radio.Group>
        </Modal>
      </div>
    </div>
  );
}
