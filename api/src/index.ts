import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { healthRouter } from './routes/health.js';

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json());

// Cada demo del portafolio se monta como un router bajo /api.
app.use('/api', healthRouter);

app.listen(PORT, () => {
  console.log(`[api] escuchando en http://localhost:${PORT}`);
});
