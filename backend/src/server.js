import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import stellarRoutes from './routes/stellar.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/stellar', stellarRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', network: process.env.STELLAR_NETWORK });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Network: ${process.env.STELLAR_NETWORK}`);
});
