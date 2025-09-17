import MainHeader from "../../components/MainHeader";
import Footer from "../../components/Footer";
import { Typography, Card } from "antd";
import '../../global.css';
import '../../App.css';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 relative overflow-hidden">
      {/* Decorative Background Circles */}
      <div className="absolute inset-0 opacity-25">
        <div className="absolute top-16 left-12 w-32 h-32 bg-gradient-to-br from-orange-200 to-rose-200 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full blur-lg animate-pulse delay-300"></div>
        <div className="absolute bottom-36 left-16 w-40 h-40 bg-gradient-to-br from-rose-200 to-pink-200 rounded-full blur-xl animate-pulse delay-700"></div>
        <div className="absolute bottom-20 right-12 w-28 h-28 bg-gradient-to-br from-orange-300 to-amber-300 rounded-full blur-lg animate-pulse delay-1000"></div>
      </div>

      {/* Fixed Header */}
      <MainHeader />

      {/* Main Content */}
      <main className="container flex justify-center items-center min-h-[70vh] px-4 md:px-6 relative z-10">
        <div className="max-w-3xl w-full text-center">
          {/* Main Card */}
          <Card
            className="shadow-xl transform hover:scale-[1.02] transition-all duration-500 ease-out backdrop-blur-lg"
            style={{
              borderRadius: 20,
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(254,251,246,0.92) 100%)',
              boxShadow: '0 10px 40px rgba(238,77,45,0.15)',
              padding: '2rem'
            }}
          >
            {/* Logo Animation */}
            <div className="mb-6 relative flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-rose-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <div className="w-8 h-8 bg-white rounded-full opacity-80"></div>
              </div>
              <div className="absolute w-16 h-16 bg-gradient-to-br from-orange-300 to-rose-300 rounded-full animate-ping opacity-20"></div>
            </div>

            {/* Title */}
            <Title
              level={1}
              className="animate-fade-in-up"
              style={{
                background: 'linear-gradient(135deg, #166534 0%, #15803d 50%, #dc2626 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textAlign: 'center',
                marginBottom: 20,
                fontSize: '2.5rem',
                fontWeight: 800
              }}
            >
              {t("welcomeToBanHuong")}
            </Title>

            {/* Description */}
            <Paragraph
              className="animate-fade-in-up delay-200"
              style={{
                fontSize: "18px",
                color: "#4b5563",
                textAlign: "center",
                lineHeight: 1.7,
                maxWidth: 500,
                margin: "0 auto"
              }}
            >
              {t("websiteIntro")}
            </Paragraph>
          </Card>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-10 px-6">
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
