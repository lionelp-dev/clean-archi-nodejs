import { MissingParamError } from "./missing-param-error";

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
  static unAuthorized() {
    return {
      statusCode: 401,
    };
  }
}
