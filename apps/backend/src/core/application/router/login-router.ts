import { HttpResponse } from "../helpers/http-response";
interface IHttpRequest {
  statusCode?: number;
  body?: { email?: String; password?: String };
}
interface IHttpResponse {
  statusCode?: number;
  body?: any;
}
export class LoginRouter {
  async route(httpRequest?: IHttpRequest): Promise<any> {
    if (!httpRequest || !httpRequest.body) {
      return HttpResponse.internalServerError();
    }
    if (!httpRequest.body.email) {
      return HttpResponse.badRequest("email");
    }
    if (!httpRequest.body.password) {
      return HttpResponse.badRequest("password");
    }
  }
}
