import StatusError from './StatusError';

export default class InternalServerError extends StatusError {
  constructor(message: string) {
    super(message, 500);
  }
}
