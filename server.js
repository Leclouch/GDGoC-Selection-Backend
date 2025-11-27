// server.js
import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import menuRoutes from './routes/menu.route.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

console.log("Loaded key:", process.env.GEMINI_API_KEY);


// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
  })
  .catch((error) => {
    console.log('❌ MongoDB Connection Failed:', error.message);
    process.exit(1);
  });

// Health Check
app.get('/', (req, res) => {
  res.json({ message: 'Menu Catalog API is running!' });
});

// Routes
app.use('/api/menu', menuRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});