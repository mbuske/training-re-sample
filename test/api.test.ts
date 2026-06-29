import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/server';

const app = createApp();

describe('GET /api/me', () => {
  it('returns the resolved user with permissions', async () => {
    const res = await request(app).get('/api/me').set('X-User-Id', 'u-anna');
    expect(res.status).toBe(200);
    expect(res.body.orgId).toBe('org-a');
    expect(res.body.permissions).toContain('risk.export');
  });

  it('401s without a user', async () => {
    const res = await request(app).get('/api/me');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/risks', () => {
  it('returns only the caller org and never leaks sensitive fields', async () => {
    const res = await request(app).get('/api/risks').set('X-User-Id', 'u-anna');
    expect(res.status).toBe(200);
    expect(res.body.risks).toHaveLength(9);
    const sample = res.body.risks[0];
    expect(sample).toHaveProperty('ownerDisplayName');
    expect(sample).not.toHaveProperty('internalNotes');
    expect(sample).not.toHaveProperty('ownerEmail');
    expect(sample).not.toHaveProperty('orgId');
  });

  it('applies server-side filters', async () => {
    const res = await request(app)
      .get('/api/risks')
      .query({ status: 'open' })
      .set('X-User-Id', 'u-anna');
    expect(res.status).toBe(200);
    expect(res.body.risks.every((r: { status: string }) => r.status === 'open')).toBe(true);
  });

  it('400s on an invalid filter', async () => {
    const res = await request(app)
      .get('/api/risks')
      .query({ status: 'banana' })
      .set('X-User-Id', 'u-anna');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('invalid_filter');
  });

  it('sees a different org for a different caller', async () => {
    const res = await request(app).get('/api/risks').set('X-User-Id', 'u-sara');
    expect(res.body.risks).toHaveLength(6);
  });
});
