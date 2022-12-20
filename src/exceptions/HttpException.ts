export class HttpException extends Error {
  readonly success: boolean;

  constructor(readonly statusCode: number, readonly message: string) {
    super(message);
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }
}
