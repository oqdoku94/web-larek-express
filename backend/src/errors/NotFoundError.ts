import StatusError from './StatusError';

export default class NotFoundError extends StatusError {
  constructor(message: string) {
    super(message, 404);
  }
}
