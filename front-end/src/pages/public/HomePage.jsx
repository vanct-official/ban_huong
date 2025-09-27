import { Typography, Card, Button } from "antd";
import "../../App.css";
import "../../global.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import MainHeader from "../../components/MainHeader";
import Footer from "../../components/Footer";
import { useEffect } from "react";

const { Title, Paragraph } = Typography;

export default function HomePage() {
  useEffect(() => {
    document.title = "Trang chủ - Bản Hương";
  }, []);

  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 relative overflow-hidden">
      {/* Decorative Background Circles */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <div className="absolute top-16 left-12 w-32 h-32 bg-gradient-to-br from-orange-200 to-rose-200 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full blur-lg animate-pulse delay-300"></div>
        <div className="absolute bottom-36 left-16 w-40 h-40 bg-gradient-to-br from-rose-200 to-pink-200 rounded-full blur-xl animate-pulse delay-700"></div>
        <div className="absolute bottom-20 right-12 w-28 h-28 bg-gradient-to-br from-orange-300 to-amber-300 rounded-full blur-lg animate-pulse delay-1000"></div>
      </div>
      <MainHeader />
      {/* Main Content */}
      <main className="container flex flex-col justify-center items-center min-h-[70vh] px-4 md:px-6 relative z-10">
        {/* Logo & Slogan */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <img
              src="/image/BanHuong.png"
              alt="Bản Hương"
              className="rounded-2xl shadow-xl"
              style={{
                width: 150,
                height: 150,
                objectFit: "cover",
                alignContent: "center",
                border: "4px solid #fff",
              }}
            />
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-3 bg-gradient-to-r from-orange-200 to-rose-200 rounded-full blur-md opacity-60"></div>
          </div>
          <Title
            level={1}
            style={{
              background:
                "linear-gradient(135deg, #166534 0%, #15803d 50%, #dc2626 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textAlign: "center",
              fontWeight: 800,
              fontSize: "2.5rem",
              marginBottom: 0,
              letterSpacing: -1,
            }}
            className="animate-fade-in-up"
          >
            {t("welcomeToBanHuong")}
          </Title>
          <Paragraph
            style={{
              color: "#166534",
              fontWeight: 500,
              fontSize: 18,
              marginTop: 8,
              marginBottom: 0,
              textAlign: "center",
            }}
          >
            Tinh dầu thiên nhiên – Sống xanh, thư giãn, an toàn.
          </Paragraph>
        </div>

        {/* Main Card */}
        <Card
          className="shadow-xl animate-fade-in-up"
          style={{
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.2)",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(254,251,246,0.96) 100%)",
            boxShadow: "0 10px 40px rgba(238,77,45,0.10)",
            padding: "2rem",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          <Paragraph
            style={{
              fontSize: "18px",
              color: "#4b5563",
              textAlign: "center",
              lineHeight: 1.7,
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            {t("websiteIntro")}
          </Paragraph>

          <Link to="/products">
            <Button
              type="primary"
              size="large"
              style={{
                marginTop: 32,
                borderRadius: 12,
                fontWeight: 700,
                background: "linear-gradient(135deg, #166534 0%, #15803d 100%)",
                border: "none",
                boxShadow: "0 2px 12px rgba(22,101,52,0.15)",
              }}
            >
              Khám phá sản phẩm
            </Button>
          </Link>
        </Card>
        <section
          style={{
            marginTop: 60,
            maxWidth: 900,
            marginLeft: "auto",
            marginRight: "auto",
            padding: "0 16px",
          }}
        >
          <Title
            level={2}
            style={{
              textAlign: "center",
              color: "#166534",
              fontWeight: 800,
              marginBottom: 24,
            }}
          >
            Giới thiệu về Bản Hương
          </Title>

          <Paragraph
            style={{ fontSize: 16, lineHeight: 1.8, color: "#374151" }}
          >
            <strong>
              Bản Hương – Tinh dầu thiên nhiên cho cuộc sống xanh.
            </strong>{" "}
            Trong nhịp sống hối hả, đôi khi chúng ta quên mất việc chăm sóc cho
            chính mình. Bản Hương ra đời với mong muốn mang lại sự cân bằng cho
            bạn qua những sản phẩm tinh dầu thiên nhiên nguyên chất.
          </Paragraph>

          <Paragraph
            style={{ fontSize: 16, lineHeight: 1.8, color: "#374151" }}
          >
            Mỗi giọt tinh dầu đều được chắt lọc từ nguyên liệu sạch, an toàn,
            giữ trọn hương thơm tinh túy từ thiên nhiên. Chúng tôi tin rằng
            hương thơm không chỉ để thư giãn, mà còn là một liệu pháp giúp bạn
            tái tạo năng lượng, giảm căng thẳng, và tìm lại sự bình yên.
          </Paragraph>

          <Paragraph
            style={{ fontSize: 16, lineHeight: 1.8, color: "#374151" }}
          >
            Hãy để Bản Hương đồng hành cùng bạn trên hành trình sống xanh, lành
            mạnh và đầy cảm hứng.
          </Paragraph>
        </section>
      </main>
      <Footer />
    </div>
  );
}
