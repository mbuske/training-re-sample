import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { type NextFunction, type Request, type Response } from 'express';
import { devAuth } from './auth/devAuth';
import { sessionRouter } from './api/session';
import { risksRouter } from './api/risks';
import { HttpError } from './lib/httpError';

const here = path.dirname(fileURLToPath(import.meta.url));

export function createApp(): express.Express {
  const app = express();
  app.use(express.json());

  // All /api routes require a resolved dev-auth user.
  app.use('/api', devAuth);
  app.use('/api/me', sessionRouter);
  app.use('/api/risks', risksRouter);

  // Static frontend (no auth) — served from ../public relative to src/.
  app.use(express.static(path.resolve(here, '../public')));

  // JSON 404 for unmatched /api routes — keeps the { error: { code, message } } contract.
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: { code: 'not_found', message: 'Unknown API route' } });
  });

  // Central error middleware → { error: { code, message } }.
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const status = err instanceof HttpError ? err.status : 500;
    const code = err instanceof HttpError ? err.code : 'internal_error';
    const message = err instanceof Error ? err.message : 'Unexpected error';
    res.status(status).json({ error: { code, message } });
  });

  return app;
}

if (process.env.NODE_ENV !== 'test') {
  const port = Number(process.env.PORT ?? 3000);
  createApp().listen(port, () => {
    console.log(`training-re-sample running on http://localhost:${port}`);
  });
}
