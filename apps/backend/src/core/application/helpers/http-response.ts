import {
  InternalServerError,
  InvalidParamError,
  UnAuthorizedError,
} from "../errors";

export class HttpResponse {
  static badRequest(data: Error) {
    return {
      statusCode: 400,
      body: data,
    };
  }
  static InvalidParamError() {
    return {
      statusCode: 400,
      body: new InvalidParamError("email"),
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
  static ok(data: any) {
    return {
      statusCode: 200,
      body: data,
    };
  }
}
