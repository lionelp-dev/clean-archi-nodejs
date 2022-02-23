import { AuthUseCase } from "../../domain/usecases/AuthUseCase";
import {
  InvalidParamError,
  MissingParamError,
  UnAuthorizedError,
} from "../errors";
import { LoginRouter } from "./login-router";

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase();
  const emailValidatorSpy = makeEmailValidator();
  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy);
  return {
    sut,
    authUseCaseSpy,
    emailValidatorSpy,
  };
};

const makeAuthUseCase = () => {
  class AuthUseCaseSpy implements AuthUseCase {
    params: AuthUseCase.Params;
    result = {
      accessToken: "any_access_token",
    };
    async auth(params: AuthUseCase.Params): Promise<AuthUseCase.Result> {
      this.params = params;
      return this.result;
    }
  }
  return new AuthUseCaseSpy();
};

const makeEmailValidator = () => {
  class EmailValidatorSpy {
    isEmailValid: boolean | undefined;
    email: string | undefined;
    isValid(email: string) {
      this.email = email;
      return this.isEmailValid;
    }
  }
  const emailValidatorSpy = new EmailValidatorSpy();
  emailValidatorSpy.isEmailValid = true;
  return emailValidatorSpy;
};

const makeEmailValidatorWithError = () => {
  class emailValidatorSpy {
    isValid() {
      throw new ReferenceError();
    }
  }
  return new emailValidatorSpy();
};

describe("Login Router", () => {
  it("should return 400 if no email is not provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: "any_password",
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse?.statusCode).toBe(400);
    expect(httpResponse?.body).toEqual(new MissingParamError("email"));
  });

  it("should return 400 if no password is not provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@email.com",
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse?.statusCode).toBe(400);
    expect(httpResponse?.body).toEqual(new MissingParamError("password"));
  });

  it("should return a AuthUseCase with correct params", async () => {
    const { sut, authUseCaseSpy } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };
    await sut.route(httpRequest);
    expect(authUseCaseSpy.params.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.params.password).toBe(httpRequest.body.password);
  });

  it("should return 401 when invalid credentials are provided", async () => {
    const { sut, authUseCaseSpy } = makeSut();
    authUseCaseSpy.result = null;
    const httpRequest = {
      body: {
        email: "invalid_email@email.com",
        password: "invalid_password",
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse?.body).toEqual(new UnAuthorizedError());
  });

  it("should return 200 when valid credentials are provided", async () => {
    const { sut, authUseCaseSpy } = makeSut();
    authUseCaseSpy.result = { accessToken: "valid_token" };
    const httpRequest = {
      body: {
        email: "valid_email@email.com",
        password: "valid_password",
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body?.accessToken).toEqual(
      authUseCaseSpy.result.accessToken
    );
  });

  it("should return 400 if an invalid email is provided", async () => {
    const { sut, emailValidatorSpy } = makeSut();
    emailValidatorSpy.isEmailValid = false;
    const httpRequest = {
      body: {
        email: "invalid_email",
        password: "any_password",
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse?.statusCode).toBe(400);
    expect(httpResponse?.body).toEqual(new InvalidParamError("email"));
  });

  it("should return call EmailValidatorl with correct email", async () => {
    const { sut, emailValidatorSpy } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };
    await sut.route(httpRequest);
    expect(emailValidatorSpy?.email).toBe(httpRequest.body.email);
  });

  it("should return 500 if  EmailValidator throws", async () => {
    const authUseCaseSpy = makeAuthUseCase();
    const emailValidatorSpy = makeEmailValidatorWithError();
    const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy);
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse?.statusCode).toBe(500);
  });
});
