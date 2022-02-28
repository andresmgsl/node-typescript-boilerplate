export abstract class EventError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

/** Thrown if an account is not found at the expected address */
export class EventAccountNotFoundError extends EventError {
  name = 'EventAccountNotFoundError';
}
