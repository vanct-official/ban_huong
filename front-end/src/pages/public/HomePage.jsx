import MainHeader from "../../components/MainHeader";
import Footer from "../../components/Footer";
import { Typography, Card, Button } from "antd";
import '../../global.css';
import '../../App.css';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

export default function HomePage() {
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

      {/* Header */}
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
              style={{ width: 90, height: 90, objectFit: "cover", border: "4px solid #fff" }}
            />
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-3 bg-gradient-to-r from-orange-200 to-rose-200 rounded-full blur-md opacity-60"></div>
          </div>
          <Title
            level={1}
            style={{
              background: 'linear-gradient(135deg, #166534 0%, #15803d 50%, #dc2626 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textAlign: 'center',
              fontWeight: 800,
              fontSize: '2.5rem',
              marginBottom: 0,
              letterSpacing: -1
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
              textAlign: "center"
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
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(254,251,246,0.96) 100%)',
            boxShadow: '0 10px 40px rgba(238,77,45,0.10)',
            padding: '2rem',
            maxWidth: 600,
            margin: "0 auto"
          }}
        >
          <Paragraph
            style={{
              fontSize: "18px",
              color: "#4b5563",
              textAlign: "center",
              lineHeight: 1.7,
              maxWidth: 520,
              margin: "0 auto"
            }}
          >
            {t("websiteIntro")}
          </Paragraph>
          <Button
            type="primary"
            size="large"
            style={{
              marginTop: 32,
              borderRadius: 12,
              fontWeight: 700,
              background: "linear-gradient(135deg, #166534 0%, #15803d 100%)",
              border: "none",
              boxShadow: "0 2px 12px rgba(22,101,52,0.15)"
            }}
            href="/products"
          >
            Khám phá sản phẩm
          </Button>
        </Card>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-10 px-6 w-full max-w-4xl">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center animate-float">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl mb-4">
              <span className="text-white text-2xl">🌿</span>
            </div>
            <span className="text-base text-gray-700 font-semibold tracking-wide">
              Thiên nhiên
            </span>
            <p className="mt-2 text-sm text-gray-500 max-w-[220px]">
              Sản phẩm từ thiên nhiên, an toàn và gần gũi với môi trường.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center animate-float delay-200">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl mb-4">
              <span className="text-white text-2xl">💧</span>
            </div>
            <span className="text-base text-gray-700 font-semibold tracking-wide">
              Tinh khiết
            </span>
            <p className="mt-2 text-sm text-gray-500 max-w-[220px]">
              Giữ trọn vẹn hương vị tinh khiết của hoa hồi thiên nhiên.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center animate-float delay-400">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl mb-4">
              <span className="text-white text-2xl">✨</span>
            </div>
            <span className="text-base text-gray-700 font-semibold tracking-wide">
              Thư giãn
            </span>
            <p className="mt-2 text-sm text-gray-500 max-w-[220px]">
              Mang lại cảm giác thư giãn và cân bằng tinh thần.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .delay-200 { animation-delay: 200ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-700 { animation-delay: 700ms; }
        .delay-1000 { animation-delay: 1000ms; }
      `}</style>
    </div>
  );
}
