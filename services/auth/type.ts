export type AuthUser = {
  id?: string | number;
  name?: string;
  nome?: string;
  username?: string;
  full_name?: string;
  email: string;
  role?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
  remember?: boolean;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

export type TeacherRegisterPayload = {
  username: string;
  email: string;
  password: string;
  nome: string;
  telefone: string;
  bi: string;
  genero: "MASCULINO" | "FEMENINO";
};

export type AuthSession = {
  access: string;
  refresh: string;
  user: AuthUser;
};

export type RefreshResult = {
  access: string;
  refresh: string;
};

export type PasswordResetPayload = {
  email: string;
};

export type ConfirmPasswordPayload = {
  token: string;
  newPassword: string;
  confirmPassword: string;
};

export type AuthStatus = "authenticated" | "unauthenticated";

export type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: AuthStatus;
  hydrated: boolean;
};
