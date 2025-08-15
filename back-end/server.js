import express from 'express';
import passport from 'passport';
import session from 'express-session';
import dotenv from 'dotenv';
import cors from 'cors';
import './config/passportConfig.js';
import { connectDB } from './config/db.js';

import { getProvinces } from './controllers/province.controller.js';
import { getAllUsers } from './controllers/user.controller.js';

// Routes
import authRoutes from './routes/auth.route.js';
dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Kết nối DB
connectDB();

// Routes
app.get('/api/provinces', getProvinces);
app.get('/api/users', getAllUsers);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
