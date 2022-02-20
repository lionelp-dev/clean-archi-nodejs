export class InternalServerError extends Error {
  constructor() {
    super(`internalServerError:`);
    this.name = "internalServerError";
  }
}
// add 1 + 2
