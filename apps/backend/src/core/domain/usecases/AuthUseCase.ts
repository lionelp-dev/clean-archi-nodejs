export interface AuthUseCase {
  auth: (
    authenticationParams: AuthUseCase.Params
  ) => Promise<AuthUseCase.Result>;
}

export namespace AuthUseCase {
  export type Params = {
    email: string;
    password: string;
  };

  export type Result = {
    accessToken?: string;
  };
}
