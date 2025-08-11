//Đây là file mẫu cho trang soạn thảo văn bản với Rich Text Editor

import React, { useState } from 'react';
import { Card, Typography, Button, Space } from 'antd';
import RichTextEditor from '../components/RichTextEditor/RichTextEditor';

const { Title } = Typography;

export default function TextArea() {
  const [content, setContent] = useState('');

  const handleSave = () => {
    console.log('Nội dung đã nhập:', content);
  };

  return (
    <Space direction="vertical" style={{ width: '100%', padding: 20 }}>
      {/* Khung soạn thảo */}
      <Card bordered={true} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Title level={3} style={{ marginBottom: 20 }}>
          ✏️ Rich Text Editor
        </Title>
        <RichTextEditor value={content} onChange={setContent} />
        <Button 
          type="primary" 
          style={{ marginTop: 20 }} 
          onClick={handleSave}
        >
          Lưu nội dung
        </Button>
      </Card>

      {/* Khung xem trước */}
      <Card bordered={true} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Title level={4}>📄 Preview</Title>
        <div 
          style={{ minHeight: 100 }} 
          dangerouslySetInnerHTML={{ __html: content }} 
        />
      </Card>
    </Space>
  );
}
