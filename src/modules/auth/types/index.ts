export type RegisterBody = {
  name: string;
  email: string;
  password: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type RefreshBody = {
  refreshToken?: string;
};

export type AuthUserView = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type AuthResponseData = {
  user: AuthUserView;
  token: string;
  refreshToken: string;
  expiredToken: number;
};
