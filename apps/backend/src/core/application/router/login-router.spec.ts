import { MissingParamError } from "../helpers/missing-errors";
import { LoginRouter } from "./login-router";

const MakeSut = () => {
  return new LoginRouter();
};

describe("Login Router", () => {
  it("should return 400 if no email is not provided", async () => {
    const sut = MakeSut();
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
    const sut = MakeSut();
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
    const sut = MakeSut();
    const httpResponse = await sut.route();
    expect(httpResponse?.statusCode).toBe(500);
  });

  it("should return 500 if httpRequest has no body", async () => {
    const sut = MakeSut();
    const httpResponse = await sut.route({});
    expect(httpResponse?.statusCode).toBe(500);
  });
});
