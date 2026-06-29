import { describe, it, expect } from 'vitest';
import { EXPORT_FIELD_ALLOWLIST } from '../src/domain';
import { HttpError } from '../src/lib/httpError';

describe('domain constants', () => {
  it('documents the allowed export fields without sensitive ones', () => {
    expect(EXPORT_FIELD_ALLOWLIST).toContain('Risk ID');
    expect(EXPORT_FIELD_ALLOWLIST).toContain('Owner display name');
    expect(EXPORT_FIELD_ALLOWLIST).not.toContain('ownerEmail');
    expect(EXPORT_FIELD_ALLOWLIST).not.toContain('internalNotes');
  });
});

describe('HttpError', () => {
  it('carries status and code', () => {
    const err = new HttpError(403, 'forbidden', 'nope');
    expect(err.status).toBe(403);
    expect(err.code).toBe('forbidden');
    expect(err.message).toBe('nope');
    expect(err).toBeInstanceOf(Error);
  });
});
