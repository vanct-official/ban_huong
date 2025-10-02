import { Row, Col, Card } from "antd";
import {
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  TruckOutlined,
  TrophyOutlined,
  TeamOutlined,
} from "@ant-design/icons";

export default function TrustSignals() {
  const items = [
    {
      icon: <CheckCircleOutlined style={{ fontSize: 36, color: "#166534" }} />,
      title: "100% thiên nhiên nguyên chất",
      desc: "Tinh dầu nhập khẩu chính hãng, không pha tạp",
    },
    {
      icon: (
        <SafetyCertificateOutlined style={{ fontSize: 36, color: "#166534" }} />
      ),
      title: "Chứng nhận an toàn",
      desc: "Đạt chuẩn an toàn & kiểm định chất lượng",
    },
    {
      icon: <TruckOutlined style={{ fontSize: 36, color: "#166534" }} />,
      title: "Giao hàng toàn quốc",
      desc: "Nhanh chóng - tiện lợi - đảm bảo",
    },
    {
      icon: <TeamOutlined style={{ fontSize: 36, color: "#166534" }} />,
      title: "Được tin dùng",
      desc: "Hàng ngàn spa & doanh nghiệp lựa chọn",
    },
  ];

  return (
    <div
      style={{
        background: "#fff",
        padding: "50px 20px",
        borderRadius: 12,
        margin: "40px auto",
        maxWidth: 1000,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      <Row gutter={[24, 24]} justify="center">
        {items.map((item, i) => (
          <Col xs={24} sm={12} md={8} lg={6} key={i}>
            <Card
              bordered={false}
              style={{
                textAlign: "center",
                borderRadius: 12,
                padding: "20px",
                minHeight: 200,
                height: "100%",
              }}
            >
              {item.icon}
              <h3 style={{ marginTop: 12, fontWeight: 700, color: "#166534" }}>
                {item.title}
              </h3>
              <p style={{ color: "#555" }}>{item.desc}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
