export default abstract class StatusError extends Error {
  private readonly code: number = 0;

  public get statusCode(): number {
    return this.code;
  }

  protected constructor(message: string, statusCode: number) {
    super(message);
    this.code = statusCode;
  }
}
