import { api } from "./axiosConfig";

export interface Convocatoria {
  id: number;
  titulo: string;
  descripcion: string;
  requisitos: string;
  cupoMaximo: number;
  fechaPublicacion: string;
  fechaCierre: string;
  fechaInicioPostulacion: string;
  fechaFinPostulacion: string;
  clubId: number;
  clubNombre: string;
  estado: string;
}

export interface FetchConvocatoriasParams {
  page?: number;
  size?: number;
}

export interface CreateConvocatoriaPayload {
  titulo: string;
  descripcion: string;
  cupoMaximo: number;
  fechaPublicacion: string;
  fechaCierre: string;
  fechaInicioPostulacion: string;
  fechaFinPostulacion: string;
  requisitos: string;
}

export interface PaginatedConvocatorias {
  items: Convocatoria[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

type AnyResponse = {
  [key: string]: unknown;
  content?: Convocatoria[];
  items?: Convocatoria[];
  data?: Convocatoria[];
  results?: Convocatoria[];
  convocatorias?: Convocatoria[];
  registros?: Convocatoria[];
  total?: number;
  totalItems?: number;
  totalElements?: number;
  totalRegistros?: number;
  totalPages?: number;
  paginas?: number;
  page?: number;
  pageNumber?: number;
  currentPage?: number;
  size?: number;
  pageSize?: number;
};

const extractList = (payload: AnyResponse | Convocatoria[]): Convocatoria[] => {
  if (Array.isArray(payload)) return payload;
  return (
    payload.content ??
    payload.items ??
    payload.data ??
    payload.results ??
    payload.convocatorias ??
    payload.registros ??
    []
  );
};

const extractNumber = (payload: AnyResponse, keys: string[], fallback: number): number => {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "number" && !Number.isNaN(value)) {
      return value;
    }
  }
  return fallback;
};

const buildPaginatedResponse = (
  payload: AnyResponse | Convocatoria[],
  params?: FetchConvocatoriasParams,
): PaginatedConvocatorias => {
  const list = extractList(payload);
  const total =
    !Array.isArray(payload) && typeof payload === "object"
      ? extractNumber(payload, ["totalElements", "totalItems", "total", "totalRegistros"], list.length)
      : list.length;

  const resolvedPayload = Array.isArray(payload)
    ? { page: params?.page ?? 0, size: params?.size ?? list.length }
    : payload;

  const page = extractNumber(resolvedPayload as AnyResponse, ["page", "pageNumber", "currentPage"], params?.page ?? 0);
  const pageSize = extractNumber(resolvedPayload as AnyResponse, ["size", "pageSize"], params?.size ?? list.length);
  const totalPages =
    !Array.isArray(payload) && typeof payload === "object"
      ? extractNumber(payload, ["totalPages", "paginas"], Math.max(1, Math.ceil(total / Math.max(pageSize, 1))))
      : Math.max(1, Math.ceil(total / Math.max(pageSize, 1)));

  return {
    items: list,
    total,
    page,
    pageSize,
    totalPages: totalPages || 1,
  };
};

const requestConvocatorias = async (
  endpoint: string,
  params?: FetchConvocatoriasParams,
) => {
  const response = await api.get<AnyResponse | Convocatoria[]>(endpoint, {
    params,
  });
  return buildPaginatedResponse(response.data, params);
};

export const fetchPublicConvocatorias = (params?: FetchConvocatoriasParams) =>
  requestConvocatorias("/convocatorias/public", params);

export const fetchClubConvocatorias = (params?: FetchConvocatoriasParams) =>
  requestConvocatorias("/convocatorias", params);

export const createConvocatoria = async (payload: CreateConvocatoriaPayload) => {
  const response = await api.post<Convocatoria>("/convocatorias", payload);
  return response.data;
};
