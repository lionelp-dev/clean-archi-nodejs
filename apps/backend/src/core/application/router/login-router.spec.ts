import { InvalidParamError } from "../helpers/invalid-param-error ";
import { MissingParamError } from "../helpers/missing-param-error";
import { InternalServerError } from "../helpers/server-errorr";
import { UnAuthorizedError } from "../helpers/unauthorized-error";
import { LoginRouter } from "./login-router";

const MakeSut = () => {
  const authUseCaseSpy = makeAuthUseCase();
  const emailValidatorSpy = makeEmailValidatorSpy();
  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy);
  return {
    sut,
    authUseCaseSpy,
    emailValidatorSpy,
  };
};

const makeEmailValidatorSpy = () => {
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
      throw new Error();
    }
  }
  return new emailValidatorSpy();
};

const makeAuthUseCase = () => {
  class AuthUseCaseSpy {
    email: string | undefined;
    password: string | undefined;
    accessToken?: string | undefined;
    auth(email: string, password: string) {
      this.email = email;
      this.password = password;
      return this.accessToken;
    }
  }
  return new AuthUseCaseSpy();
};

const makeAuthUseCaseWithError = () => {
  class AuthUseCaseSpy {
    auth() {
      throw new Error();
    }
  }
  return new AuthUseCaseSpy();
};

describe("Login Router", () => {
  it("should return 400 if no email is not provided", async () => {
    const { sut } = MakeSut();
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
    const { sut } = MakeSut();
    const httpRequest = {
      body: {
        email: "any_email@email.com",
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse?.statusCode).toBe(400);
    expect(httpResponse?.body).toEqual(new MissingParamError("password"));
  });

  it("should return 500 if no httpRequest is not provided", async () => {
    const { sut } = MakeSut();
    const httpResponse = await sut.route();

    expect(httpResponse?.statusCode).toBe(500);
    expect(httpResponse?.body).toEqual(new InternalServerError());
  });

  it("should return 500 if httpRequest has no body", async () => {
    const { sut } = MakeSut();
    const httpResponse = await sut.route();

    expect(httpResponse?.statusCode).toBe(500);
    expect(httpResponse?.body).toEqual(new InternalServerError());
  });

  it("should return a AuthUseCase with correct params", async () => {
    const { sut, authUseCaseSpy } = MakeSut();
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };
    await sut.route(httpRequest);
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
  });

  it("should return 401 when invalid credentials are provided", async () => {
    const { sut } = MakeSut();
    const authUseCaseSpy = makeAuthUseCase();
    authUseCaseSpy.accessToken = undefined;
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
    const { sut, authUseCaseSpy } = MakeSut();
    authUseCaseSpy.accessToken = "valid_token";
    const httpRequest = {
      body: {
        email: "valid_email@email.com",
        password: "valid_password",
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body?.accessToken).toEqual(authUseCaseSpy.accessToken);
  });

  it("should return 500 when no AuthUseCase are provided", async () => {
    const sut = new LoginRouter();
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse?.body).toEqual(new InternalServerError());
  });

  it("should return 500 if AuthUseCase has no auth method", async () => {
    const authUseCaseSpy = makeAuthUseCaseWithError();
    const sut = new LoginRouter(authUseCaseSpy);
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse?.body).toEqual(new InternalServerError());
  });

  it("should return 400 if an invalid email is provided", async () => {
    const { sut, emailValidatorSpy } = MakeSut();
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
  it("should return 500 if no EmailValidatorl is provided", async () => {
    const { authUseCaseSpy } = MakeSut();
    const sut = new LoginRouter(authUseCaseSpy);
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse?.statusCode).toBe(500);
  });
  it("should return 500 if an EmailValidatorl has no isValid method", async () => {
    const { authUseCaseSpy } = MakeSut();
    const sut = new LoginRouter(authUseCaseSpy, {});
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse?.statusCode).toBe(500);
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
