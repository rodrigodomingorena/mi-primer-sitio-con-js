export class ConnectionError extends Error {
  constructor(error) {
    super(error.message);

    this.name = "ConnectionError";
    this.cause = error;
  }
}