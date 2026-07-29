import { Router } from 'express';
import type { HealthResponse } from '@portfolio/shared';

export const healthRouter = Router();

healthRouter.get('/health', (_req, res) => {
  const body: HealthResponse = {
    status: 'ok',
    service: 'portfolio-api',
    timestamp: new Date().toISOString(),
  };
  res.json(body);
});
