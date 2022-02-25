import { AuthEntities } from "../../domain/entities/auth-entities";
import { InvalidParamError, MissingParamError } from "../errors";
import { HttpResponse } from "../helpers/http-response";

export namespace LoginRouter {
  export type HttpRespose = {
    statusCode: number;
    body: any;
  };
  export type Request = {
    body: { email?: string; password?: string };
  };
}

export interface EmailValidator {
  isValid: (email?: string) => boolean | any;
}
export class LoginRouter {
  constructor(
    private readonly authUseCase: AuthEntities,
    private readonly emailValidator: EmailValidator
  ) {}
  async route(
    httpRequest: LoginRouter.Request
  ): Promise<LoginRouter.HttpRespose> {
    try {
      const { email, password } = httpRequest.body;
      if (!email) {
        return HttpResponse.badRequest(new MissingParamError("email"));
      }
      if (!this.emailValidator.isValid(email)) {
        return HttpResponse.badRequest(new InvalidParamError("email"));
      }
      if (!password) {
        return HttpResponse.badRequest(new MissingParamError("password"));
      }
      const response = await this.authUseCase?.auth({ email, password });
      if (!response?.accessToken) {
        return HttpResponse.unAuthorized();
      }
      return HttpResponse.ok(response);
    } catch (error) {
      return HttpResponse.internalServerError();
    }
  }
}
