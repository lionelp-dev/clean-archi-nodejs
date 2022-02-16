import { MissingParamError } from "./missing-errors";

export class HttpResponse {
  static badRequest(paramName: string) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName),
    };
  }
  static internalServerError() {
    return {
      statusCode: 500,
    };
  }
}
