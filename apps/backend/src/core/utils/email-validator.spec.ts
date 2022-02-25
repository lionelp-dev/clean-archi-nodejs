import { EmailValidator } from "./email-validator";

const makeEmailValidator = () => {
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
