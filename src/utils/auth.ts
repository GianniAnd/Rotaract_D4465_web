import { AuthSession, AuthUser, UserRole, USER_ROLES } from '../types';

const roleDictionary: Record<string, UserRole> = USER_ROLES.reduce(
  (acc, role) => ({ ...acc, [role]: role }),
  {}
);

const normalizeRole = (role?: string): UserRole => {
  if (!role) return 'INTERESADO';
  const formatted = role.toUpperCase();
  return roleDictionary[formatted] ?? 'INTERESADO';
};

const resolveUser = (rawUser: any): AuthUser => {
  if (!rawUser) {
    return { correo: '', rol: 'INTERESADO' };
  }
  const role = normalizeRole(rawUser.rol ?? rawUser.role);
  return {
    id: rawUser.id ?? rawUser._id ?? rawUser.uid,
    correo: rawUser.correo ?? rawUser.email ?? '',
    nombres: rawUser.nombres ?? rawUser.nombre ?? rawUser.firstName,
    apellidos: rawUser.apellidos ?? rawUser.lastName,
    rol: role,
  };
};

export const normalizeAuthResponse = (payload: any): AuthSession => {
  const accessToken =
    payload?.accessToken ?? payload?.token ?? payload?.access_token ?? payload?.data?.accessToken;
  const refreshToken =
    payload?.refreshToken ?? payload?.refresh_token ?? payload?.data?.refreshToken;
  if (!accessToken || !refreshToken) {
    throw new Error('No se recibieron tokens válidos del servidor.');
  }
  const rawUser = payload?.usuario ?? payload?.user ?? payload?.data?.usuario ?? payload;
  const user = resolveUser(rawUser);

  return {
    accessToken,
    refreshToken,
    user,
  };
};

export const getErrorMessage = (error: unknown) => {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null) {
    const maybeAxios = error as { response?: { data?: any }; message?: string };
    const backendMessage =
      maybeAxios.response?.data?.message ??
      maybeAxios.response?.data?.error ??
      maybeAxios.message;
    if (backendMessage) return backendMessage;
  }
  return 'Ocurrió un error inesperado. Intenta nuevamente.';
};
