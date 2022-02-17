import { access } from "fs";
import { HttpResponse } from "../helpers/http-response";
interface IHttpRequest {
  statusCode?: number;
  body?: { email?: String; password?: String };
}
export class LoginRouter {
  authUseCase: any;
  constructor(AuthUseCase?: any) {
    this.authUseCase = AuthUseCase;
  }
  async route(httpRequest?: any): Promise<any> {
    if (
      !httpRequest ||
      !httpRequest.body ||
      !this.authUseCase ||
      !this.authUseCase.auth
    ) {
      return HttpResponse.internalServerError();
    }
    const { email, password } = httpRequest.body;
    if (!email) {
      return HttpResponse.badRequest("email");
    }
    if (!password) {
      return HttpResponse.badRequest("password");
    }
    const accessToken = this.authUseCase.auth(email, password);
    if (!accessToken) {
      return HttpResponse.unAuthorized();
    }
    return HttpResponse.ok();
  }
}
