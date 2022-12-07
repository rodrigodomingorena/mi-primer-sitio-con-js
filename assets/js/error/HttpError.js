export class HttpError extends Error {
  constructor(status) {
    super("Server response: " + status);

    this.name = "HttpError";
    this.status = status;
  }
}
