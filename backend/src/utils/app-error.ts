export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly errors?: Record<string, string[] | undefined>,
  ) {
    super(message)
    this.name = 'AppError'
  }
}
