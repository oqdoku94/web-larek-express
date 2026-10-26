import StatusError from './status-error';

export default class InternalServerError extends StatusError {
  constructor(message: string) {
    super(message, 500);
  }
}
