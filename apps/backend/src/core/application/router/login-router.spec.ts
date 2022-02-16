class LoginRouter {
  route(httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return {
        statusCode: 500,
      };
    }
    if (!httpRequest.body.email || !httpRequest.body.password) {
      return {
        statusCode: 400,
      };
    }
  }
}

const MakeSut = () => {
  return new LoginRouter();
};

describe("Login Router", () => {
  it("should return 400 if no email is not provided", () => {
    const sut = MakeSut();
    const httpRequest = {
      body: {
        password: "any_password",
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
  });
  it("should return 400 if no password is not provided", () => {
    const sut = MakeSut();
    const httpRequest = {
      body: {
        password: "any_email@email.com",
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
  });
  it("should return 500 if no httpRequest is not provided", () => {
    const sut = MakeSut();
    const httpResponse = sut.route();
    expect(httpResponse.statusCode).toBe(500);
  });
  it("should return 500 if no body in httpRequest is provided", () => {
    const sut = MakeSut();
    const httpRequest = {};
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  });
});
