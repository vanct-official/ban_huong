import MainHeader from "../../components/MainHeader"
import Footer from "../../components/Footer"
import { Typography, Card } from "antd"
import '../../global.css'; // Import global styles
import '../../App.css'; // Import App styles

const { Title, Paragraph } = Typography

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-orange-200 to-rose-200 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full blur-lg animate-pulse delay-300"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-br from-rose-200 to-pink-200 rounded-full blur-xl animate-pulse delay-700"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-br from-orange-300 to-amber-300 rounded-full blur-lg animate-pulse delay-1000"></div>
      </div>

      {/* Header cố định cho toàn trang */}
      <MainHeader />

      {/* Nội dung chính */}
      <main className="container flex justify-center items-center min-h-[70vh] px-4 md:px-6 relative z-10">
        <div className="max-w-2xl w-full">
          {/* Main Card với hiệu ứng hover và animation */}
          <Card
            className="shadow-2xl transform hover:scale-105 transition-all duration-500 ease-out backdrop-blur-sm"
            style={{
              maxWidth: 520,
              width: '100%',
              borderRadius: 20,
              border: 'none',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254,251,246,0.95) 100%)',
              boxShadow: '0 20px 60px rgba(238,77,45,0.15), 0 8px 32px rgba(238,77,45,0.08)',
              margin: '0 auto'
            }}
          >
            <div className="text-center py-6">
              {/* Animated icon/logo placeholder */}
              <div className="mb-6 relative">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-400 to-rose-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <div className="w-8 h-8 bg-white rounded-full opacity-80"></div>
                </div>
                <div className="absolute inset-0 w-16 h-16 mx-auto bg-gradient-to-br from-orange-300 to-rose-300 rounded-full animate-ping opacity-20"></div>
              </div>

              <Typography>
                <Title 
                  level={1} 
                  className="animate-fade-in-up"
                  style={{ 
                    background: 'linear-gradient(135deg, #166534 0%, #15803d 50%, #dc2626 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '0 2px 4px rgba(0,0,0,0.15)', // thêm dòng này
                    textAlign: "center", 
                    marginBottom: 24,
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    letterSpacing: '-0.025em'
                  }}
                >
                  Chào mừng đến với Bản Hương!
                </Title>
                
                <Paragraph 
                  className="animate-fade-in-up delay-300"
                  style={{ 
                    fontSize: "18px", 
                    color: "#6b7280", 
                    textAlign: "center", 
                    marginBottom: 0,
                    lineHeight: 1.7,
                    fontWeight: 400
                  }}
                >
                  Website chuyên cung cấp <span className="font-semibold text-orange-600">tinh dầu hoa hồi thiên nhiên</span> – thư giãn, sống xanh, an toàn.
                </Paragraph>
              </Typography>

              {/* Decorative elements */}
              <div className="mt-8 flex justify-center space-x-2">
                <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-rose-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
          </Card>

          {/* Additional floating elements */}
          <div className="mt-12 flex justify-center space-x-8 opacity-60">
            <div className="flex flex-col items-center animate-float">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg mb-2">
                <span className="text-white font-bold text-xs">🌿</span>
              </div>
              <span className="text-xs text-gray-500 font-medium">Thiên nhiên</span>
            </div>
            
            <div className="flex flex-col items-center animate-float delay-200">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg mb-2">
                <span className="text-white font-bold text-xs">💧</span>
              </div>
              <span className="text-xs text-gray-500 font-medium">Tinh khiết</span>
            </div>
            
            <div className="flex flex-col items-center animate-float delay-400">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg mb-2">
                <span className="text-white font-bold text-xs">✨</span>
              </div>
              <span className="text-xs text-gray-500 font-medium">Thư giãn</span>
            </div>
          </div>
        </div>

        
      </main>
      <Footer />
      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .delay-150 {
          animation-delay: 150ms;
        }
        
        .delay-200 {
          animation-delay: 200ms;
        }
        
        .delay-300 {
          animation-delay: 300ms;
        }
        
        .delay-400 {
          animation-delay: 400ms;
        }
        
        .delay-700 {
          animation-delay: 700ms;
        }
        
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  )
}