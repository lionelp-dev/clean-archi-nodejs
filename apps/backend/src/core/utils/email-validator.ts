import isEmail from "validator/lib/isEmail";

export class EmailValidator {
  email: string | undefined;
  isValid(email: string) {
    this.email = email;
    return isEmail(email);
  }
}
