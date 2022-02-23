import isEmail from "validator/lib/isEmail";

const makeEmailValidator = () => {
  class EmailValidator {
    email: string | undefined;
    isValid(email: string) {
      this.email = email;
      return isEmail(email);
    }
  }
  return new EmailValidator();
};

describe("Email Validator", () => {
  it("should return true if validator returns true", () => {
    const sut = makeEmailValidator();
    const isEmailValid = sut.isValid("valid_email@email.com");
    expect(isEmailValid).toBe(true);
  });
  it("should return false if validator returns false", () => {
    const sut = makeEmailValidator();
    const isEmailValid = sut.isValid("invalid_email");
    expect(isEmailValid).toBe(false);
  });
});
