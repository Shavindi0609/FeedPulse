import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db.js';
import feedbackRoutes from './routes/feedback.routes';
import authRoutes from './routes/auth.routes';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('FeedPulse API is running...');
});

app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});

app.use('/api/feedback', feedbackRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/auth', authRoutes);