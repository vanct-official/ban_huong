import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Avatar,
  Spin,
  Alert,
  message,
  Row,
  Col,
  Tooltip,
  Divider,
  List,
  Select,
  Modal,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainHeader from "../../components/MainHeader";
import Footer from "../../components/Footer";

const EditUserProfile = () => {
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [addresses, setAddresses] = useState([]);
  const [addrLoading, setAddrLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const { Option } = Select;

  const [addressForm] = Form.useForm();

  // Load profile từ API
  useEffect(() => {
    document.title = t("editProfile") + " - Bản Hương";
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError(t("notLoggedIn"));
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error(t("fetchUserFailed"));
        }

        const data = await res.json();
        setUser(data.user);
        form.setFieldsValue(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/addresses/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAddresses(Array.isArray(data) ? data : []);
      } catch (err) {
        message.error("Lỗi khi tải địa chỉ");
        setAddresses([]);
      } finally {
        setAddrLoading(false);
      }
    };

    const fetchProvinces = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/provinces");
        const data = await res.json();
        setProvinces(data.data || data); // tuỳ API
      } catch (err) {
        message.error("Lỗi khi tải tỉnh/thành");
      }
    };

    fetchProvinces();
    fetchAddresses();
    fetchProfile();
  }, [form, t]);

  // Xử lý update
  const handleUpdate = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error(t("updateFailed"));
      }

      message.success(t("profileUpdated"));
      navigate("/profile");
    } catch (err) {
      console.error("Update error:", err);
      message.error(err.message);
    }
  };

  const fetchWards = async (provinceCode) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/wards/province/${provinceCode}`
      );
      const data = await res.json();
      setWards(data.data || data);
    } catch (err) {
      message.error("Lỗi khi tải xã/phường");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #e0e7ff 0%, #f0f4ff 100%)",
        }}
      >
        <Spin tip={t("loading")} size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #e0e7ff 0%, #f0f4ff 100%)",
        }}
      >
        <div style={{ maxWidth: 500, margin: "40px auto" }}>
          <Alert
            type="error"
            message="⚠"
            description={error}
            style={{
              borderRadius: 12,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <MainHeader />
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #e0e7ff 0%, #f0f4ff 100%)",
          padding: "40px 0",
        }}
      >
        <Card
          title={t("editProfile")}
          style={{
            maxWidth: 500,
            margin: "0 auto",
            borderRadius: 18,
            boxShadow: "0 8px 32px rgba(60,60,120,0.10)",
            border: "none",
            background: "rgba(255,255,255,0.98)",
          }}
          bodyStyle={{ padding: "32px 24px 24px 24px" }}
        >
          {/* Avatar */}
          <div
            style={{
              textAlign: "center",
              marginBottom: 24,
              position: "relative",
            }}
          >
            <Avatar
              size={100}
              src={user?.avatarImg}
              icon={<UserOutlined />}
              style={{
                marginBottom: 10,
                border: "4px solid #fff",
                boxShadow: "0 2px 8px rgba(60,60,120,0.10)",
              }}
            />
          </div>

          {/* Form */}
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdate}
            style={{ marginTop: 8 }}
          >
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item name="firstname" label={t("firstname")}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="middlename" label={t("middlename")}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="lastname" label={t("lastname")}>
              <Input />
            </Form.Item>
            <Form.Item name="phone" label={t("phone")}>
              <Input />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  marginRight: 10,
                  borderRadius: 8,
                  minWidth: 100,
                  fontWeight: 600,
                }}
              >
                {t("save")}
              </Button>
              <Button
                onClick={() => navigate("/profile")}
                style={{
                  borderRadius: 8,
                  minWidth: 100,
                  fontWeight: 600,
                }}
              >
                {t("cancel")}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default EditUserProfile;
