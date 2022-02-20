import { InternalServerError } from "./server-errorr";
import { UnAuthorizedError } from "./unauthorized-error";

export class HttpResponse {
  static badRequest(data: Error) {
    return {
      statusCode: 400,
      body: data,
    };
  }
  static internalServerError() {
    return {
      statusCode: 500,
      body: new InternalServerError(),
    };
  }
  static unAuthorized() {
    return {
      statusCode: 401,
      body: new UnAuthorizedError(),
    };
  }
  static ok(data: object) {
    return {
      statusCode: 200,
      body: data,
    };
  }
}
