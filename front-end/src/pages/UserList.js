import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Typography, Spin, Alert } from 'antd';

const { Title } = Typography;

function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/users')
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Lỗi khi lấy dữ liệu:', error);
        setError('Không thể tải dữ liệu từ server');
        setLoading(false);
      });
  }, []);

  // Cấu hình các cột cho bảng Ant Design
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Tên người dùng',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Họ',
      dataIndex: 'firstname',
      key: 'firstname',
    },
    {
      title: 'Đệm',
      dataIndex: 'middlename',
      key: 'middlename',
    },
    {
      title: 'Tên',
      dataIndex: 'lastname',
      key: 'lastname',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>📍 Danh sách người dùng</Title>

      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
      
      {loading ? (
        <Spin size="large" tip="Đang tải dữ liệu..." />
      ) : (
        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          bordered
        />
      )}
    </div>
  );
}

export default UsersList;
