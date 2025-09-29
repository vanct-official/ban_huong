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
  Switch,
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

const API_URL = process.env.REACT_APP_API_URL;

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

        const res = await fetch(`${API_URL}/api/auth/me`, {
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
        const res = await fetch(`${API_URL}/api/addresses/me`, {
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
        const res = await fetch(`${API_URL}/api/provinces`);
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
      const res = await fetch(`${API_URL}/api/auth/me`, {
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
        `${API_URL}/api/wards/province/${provinceCode}`
      );
      const data = await res.json();
      setWards(data.data || data);
    } catch (err) {
      message.error("Lỗi khi tải xã/phường");
    }
  };

  // Xử lý thêm địa chỉ
  const handleAddAddress = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Thêm địa chỉ thất bại");
      message.success("Đã thêm địa chỉ!");
      setIsModalOpen(false);
      addressForm.resetFields();
      // Reload addresses
      setAddrLoading(true);
      const addrRes = await fetch(`${API_URL}/api/addresses/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const addrData = await addrRes.json();
      setAddresses(addrData);
      setAddrLoading(false);
    } catch (err) {
      message.error(err.message);
    }
  };

  // Xử lý xóa địa chỉ
  const handleDeleteAddress = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/addresses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Xóa địa chỉ thất bại");
      message.success("Đã xóa địa chỉ!");
      // Reload addresses
      setAddrLoading(true);
      const addrRes = await fetch(`${API_URL}/api/addresses/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const addrData = await addrRes.json();
      setAddresses(addrData);
      setAddrLoading(false);
    } catch (err) {
      message.error(err.message);
    }
  };

  // Xử lý đặt địa chỉ mặc định
  const handleSetDefault = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/api/addresses/${id}/default`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Đặt mặc định thất bại");
      message.success("Đã đặt địa chỉ mặc định!");
      // Reload addresses
      setAddrLoading(true);
      const addrRes = await fetch(`${API_URL}/api/addresses/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const addrData = await addrRes.json();
      setAddresses(addrData);
      setAddrLoading(false);
    } catch (err) {
      message.error(err.message);
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
          {/* Avatar with edit icon */}
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
            <Tooltip title={t("changeAvatar")}>
              <Button
                shape="circle"
                icon={<EditOutlined />}
                size="small"
                style={{
                  position: "absolute",
                  right: "calc(50% - 50px)",
                  bottom: 18,
                  background: "#6366f1",
                  color: "#fff",
                  border: "none",
                  boxShadow: "0 2px 8px rgba(60,60,120,0.10)",
                }}
                disabled
              />
            </Tooltip>
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
            <Form.Item name="avatarImg" label={t("avatar")}>
              <Input placeholder={t("avatarUrl")} />
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

          <Divider style={{ margin: "24px 0" }}>{t("addresses")}</Divider>

          {addresses.length === 0 ? (
            <Alert
              type="info"
              message={t("noAddress") || "Bạn chưa có địa chỉ nào."}
              style={{ marginBottom: 16, borderRadius: 8 }}
            />
          ) : (
            <List
              loading={addrLoading}
              bordered
              dataSource={addresses}
              renderItem={(item) => (
                <List.Item
                  style={{
                    background: item.isDefault ? "#e0f7fa" : "#fff",
                    borderRadius: 8,
                    marginBottom: 8,
                    border: item.isDefault ? "1.5px solid #22d3ee" : undefined,
                  }}
                  actions={[
                    !item.isDefault && (
                      <Button
                        type="link"
                        onClick={() => handleSetDefault(item.id)}
                        style={{ color: "#0ea5e9", fontWeight: 600 }}
                      >
                        {t("setDefault") || "Đặt mặc định"}
                      </Button>
                    ),
                    addresses.length > 1 && (
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteAddress(item.id)}
                      >
                        {t("delete")}
                      </Button>
                    ),
                  ].filter(Boolean)}
                >
                  <List.Item.Meta
                    title={
                      <span>
                        {item.street}, {item.ward}, {item.province}
                        {item.isDefault && (
                          <span
                            style={{
                              color: "#0ea5e9",
                              fontWeight: 700,
                              marginLeft: 8,
                            }}
                          >
                            ({t("default") || "Mặc định"})
                          </span>
                        )}
                      </span>
                    }
                    description={item.note}
                  />
                </List.Item>
              )}
            />
          )}

          <Button
            type="dashed"
            icon={<PlusOutlined />}
            style={{ marginTop: 16, width: "100%" }}
            onClick={() => setIsModalOpen(true)}
          >
            {t("addNewAddress")}
          </Button>

          <Modal
            title={t("addNewAddress")}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onOk={() => addressForm.submit()}
          >
            <Form
              form={addressForm}
              layout="vertical"
              onFinish={handleAddAddress}
            >
              <Form.Item
                name="province_code"
                label="Tỉnh/Thành"
                rules={[{ required: true, message: "Chọn tỉnh/thành" }]}
              >
                <Select
                  placeholder="Chọn tỉnh/thành"
                  onChange={(value) => {
                    setSelectedProvince(value);
                    fetchWards(value); // load các xã/phường tương ứng
                    addressForm.setFieldsValue({ ward_code: undefined }); // reset ward
                  }}
                >
                  {provinces.map((p) => (
                    <Option key={p.code} value={p.code}>
                      {p.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="ward_code"
                label="Xã/Phường"
                rules={[{ required: true, message: "Chọn xã/phường" }]}
              >
                <Select
                  placeholder="Chọn xã/phường"
                  disabled={!selectedProvince}
                >
                  {wards.map((w) => (
                    <Option key={w.code} value={w.code}>
                      {w.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="street"
                label={t("street")}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="note" label={t("note")}>
                <Input />
              </Form.Item>
            </Form>
          </Modal>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default EditUserProfile;