export class UnAuthorizedError extends Error {
  constructor() {
    super(`UnAuthorized`);
    this.name = "UnAuthorizedError";
  }
}
