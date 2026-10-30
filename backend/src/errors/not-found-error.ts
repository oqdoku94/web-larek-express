import StatusError from './status-error';

export default class NotFoundError extends StatusError {
  constructor(message: string) {
    super(message, 404);
  }
}
