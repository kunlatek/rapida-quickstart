export interface ILoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface ISignupResponse {
  message: string;
  user: {
    id: string;
    email: string;
  };
}
