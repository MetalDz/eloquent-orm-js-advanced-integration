export type AuthPrincipal = {
  userId: number;
  email: string;
  role: string;
};

export type AccessTokenPayload = AuthPrincipal & {
  type: "access";
};

export type RefreshTokenPayload = {
  sub: string;
  email: string;
  role: string;
  jti: string;
  type: "refresh";
};
