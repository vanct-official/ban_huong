import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Typography, Spin, Alert } from 'antd';

const { Title } = Typography;

function ProvincesList() {
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/provinces')
      .then(response => {
        setProvinces(response.data);
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
      dataIndex: 'code',
      key: 'code',
      width: 100,
    },
    {
      title: 'Tên Tỉnh/Thành',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tên Tiếng Anh',
      dataIndex: 'name_en',
      key: 'name_en',
    },
    {
      title: 'Tên Đầy Đủ',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: 'Tên Đầy Đủ Tiếng Anh',
      dataIndex: 'full_name_en',
      key: 'full_name_en',
    },
    {
      title: 'Mã Hành Chính',
      dataIndex: 'code_name',
      key: 'code_name',
    },
    {
      title: 'ID Đơn Vị Hành Chính',
      dataIndex: 'administrative_unit_id',
      key: 'administrative_unit_id',
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>📍 Danh sách Tỉnh/Thành</Title>

      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
      
      {loading ? (
        <Spin size="large" tip="Đang tải dữ liệu..." />
      ) : (
        <Table
          dataSource={provinces}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          bordered
        />
      )}
    </div>
  );
}

export default ProvincesList;
