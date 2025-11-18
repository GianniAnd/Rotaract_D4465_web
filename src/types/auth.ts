export type UserRole =
  | "INTERESADO"
  | "SOCIO"
  | "PRESIDENTE DEL CLUB"
  | "REPRESENTANTE DISTRITAL";

export interface AuthUser {
  id?: string;
  nombre?: string;
  correo: string;
  rol: UserRole;
}

export interface AuthTokens {
  accessToken: string;
}

// Backend auth response (flat): tokens + user fields at root
export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  correo: string;
  rol: string;
}

export const roleRouteMap: Record<UserRole, string> = {
  INTERESADO: "/dashboard/interesado",
  SOCIO: "/dashboard/socio",
  "PRESIDENTE DEL CLUB": "/dashboard/presidente",
  "REPRESENTANTE DISTRITAL": "/dashboard/representante",
};
