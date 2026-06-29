import { describe, it, expect } from 'vitest';

describe('toolchain smoke test', () => {
  it('runs the vitest harness', () => {
    expect(1 + 1).toBe(2);
  });
});
