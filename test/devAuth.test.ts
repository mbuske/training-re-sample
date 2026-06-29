import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import { devAuth, requirePermission } from '../src/auth/devAuth';
import { HttpError } from '../src/lib/httpError';

function makeApp() {
  const app = express();
  app.use(devAuth);
  app.get('/read', requirePermission('risk.read'), (req, res) => res.json({ ok: true }));
  app.get('/export', requirePermission('risk.export'), (req, res) => res.json({ ok: true }));
  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = err instanceof HttpError ? err.status : 500;
    const code = err instanceof HttpError ? err.code : 'internal_error';
    res.status(status).json({ error: { code, message: (err as Error).message } });
  });
  return app;
}

describe('devAuth + requirePermission', () => {
  it('401s without an X-User-Id header', async () => {
    const res = await request(makeApp()).get('/read');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('unauthenticated');
  });

  it('401s for an unknown user id', async () => {
    const res = await request(makeApp()).get('/read').set('X-User-Id', 'nope');
    expect(res.status).toBe(401);
  });

  it('allows a permitted role', async () => {
    const res = await request(makeApp()).get('/export').set('X-User-Id', 'u-anna');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('403s a viewer requesting export', async () => {
    const res = await request(makeApp()).get('/export').set('X-User-Id', 'u-max');
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('forbidden');
  });
});
