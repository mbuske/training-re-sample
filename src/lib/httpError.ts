/**
 * Error carrying an HTTP status + machine-readable code.
 * The central Express error middleware renders it as
 * { error: { code, message } }.
 */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}
