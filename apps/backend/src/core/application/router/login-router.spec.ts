import { MissingParamError } from "../helpers/missing-param-error";
import { UnAuthorizedError } from "../helpers/unauthorized-error";
import { LoginRouter } from "./login-router";

const MakeSut = () => {
  class AuthUseCaseSpy {
    email: string | undefined;
    password: string | undefined;
    auth(email: string, password: string) {
      this.email = email;
      this.password = password;
    }
  }
  const AuthUseCase = new AuthUseCaseSpy();
  const sut = new LoginRouter(AuthUseCase);
  return {
    sut,
    AuthUseCase,
  };
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
  });
  it("should return 500 if httpRequest has no body", async () => {
    const { sut } = MakeSut();

    const httpResponse = await sut.route({});
    expect(httpResponse?.statusCode).toBe(500);
  });
  it("should return a AuthUseCase with correct params", async () => {
    const { sut, AuthUseCase } = MakeSut();
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };
    await sut.route(httpRequest);
    expect(AuthUseCase.email).toBe(httpRequest.body.email);
    expect(AuthUseCase.password).toBe(httpRequest.body.password);
  });
  it("should return 401 when invalid credentials are provided", async () => {
    const { sut } = MakeSut();
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
  });
});
