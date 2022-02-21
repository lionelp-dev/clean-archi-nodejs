import { InvalidParamError, MissingParamError } from "../errors";
import { HttpResponse } from "../helpers/http-response";
interface IHttpRespose {
  statusCode: number;
  body: { accessToken: string } | any;
}
export class LoginRouter {
  authUseCase;
  emailValidator;
  constructor(authUseCase?: any, emailValidator?: any) {
    this.authUseCase = authUseCase;
    this.emailValidator = emailValidator;
  }
  async route(httpRequest?: any): Promise<IHttpRespose> {
    try {
      const { email, password }: { email: string; password: string } =
        httpRequest?.body;
      if (!email) {
        return HttpResponse.badRequest(new MissingParamError("email"));
      }
      if (!this.emailValidator.isValid()) {
        return HttpResponse.badRequest(new InvalidParamError("email"));
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
