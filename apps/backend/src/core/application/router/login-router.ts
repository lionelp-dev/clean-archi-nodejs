import { HttpResponse } from "../helpers/http-response";
export class LoginRouter {
  authUseCase: any;
  constructor(AuthUseCase?: any) {
    this.authUseCase = AuthUseCase;
  }
  async route(httpRequest?: any): Promise<any> {
    try {
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
      return HttpResponse.ok({ accessToken });
    } catch (error) {
      return HttpResponse.internalServerError();
    }
  }
}
