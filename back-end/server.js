// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const { connectDB } = require('./config/db');

// // Load .env
// dotenv.config();

// // Tạo Express app
// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors({
//   origin: process.env.CORS_ORIGIN || '*',
// }));

// // Kết nối DB
// connectDB();

// // Route đơn giản test
// app.get('/', (req, res) => {
//   res.send('API is running...');
// });

// // Port
// const PORT = process.env.PORT || 3000;

// // Khởi chạy server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
// });

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const Province = require('./models/province.model');

const app = express();
app.use(cors());

// Kết nối Sequelize
connectDB();

// API: Lấy danh sách tỉnh
app.get('/api/provinces', async (req, res) => {
  try {
    const provinces = await Province.findAll();
    res.json(provinces);
  } catch (err) {
    console.error('❌ Error fetching provinces:', err);
    res.status(500).send('Server error');
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

