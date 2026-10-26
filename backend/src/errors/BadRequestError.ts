import StatusError from './StatusError';

export default class BadRequestError extends StatusError {
  constructor(message: string) {
    super(message, 400);
  }
}
