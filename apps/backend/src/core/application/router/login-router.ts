import { HttpResponse } from "../helpers/http-response";
import { MissingParamError } from "../helpers/missing-param-error";

interface IHttpRespose {
  statusCode: number;
  body: { accessToken: string } | any;
}
export class LoginRouter {
  authUseCase;
  constructor(authUseCase?: any) {
    this.authUseCase = authUseCase;
  }
  async route(httpRequest?: any): Promise<IHttpRespose> {
    try {
      const { email, password }: { email: string; password: string } =
        httpRequest?.body;
      if (!email) {
        return HttpResponse.badRequest(new MissingParamError("email"));
      }
      if (!password) {
        return HttpResponse.badRequest(new MissingParamError("password"));
      }
      const accessToken: string = this.authUseCase.auth(email, password);
      if (!accessToken) {
        return HttpResponse.unAuthorized();
      }
      return HttpResponse.ok({ accessToken });
    } catch (error) {
      return HttpResponse.internalServerError();
    }
  }
}
