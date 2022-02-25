export interface AuthEntities {
  auth: (
    authenticationParams: AuthEntities.Params
  ) => Promise<AuthEntities.Result>;
}

export namespace AuthEntities {
  export type Params = {
    email: string;
    password: string;
  };

  export type Result = {
    accessToken?: string;
  };
}
