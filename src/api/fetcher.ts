import { PaginationType } from "@/types/pagination";
import axios from "axios";
import { toast } from "react-toastify";
import i18n from "@/i18n";
import { URL_MANAGEMENT } from "@/constants";
import { AUTH_PATH_REFRESH } from "./apiPaths";

export type ResponsePagination<T> = {
  data: {
    data: T[];
    meta: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    };
  };
  message: string;
  statusCode: number;
};

export type Response<T> = {
  data: T;
  message: string;
  statusCode: number;
};

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  async (err) => {
    try {
      // Có thể xử lý lỗi toàn cục ở đây
      const rawMessage =
        err?.response?.data?.message || err.message || "Network Error";
      if (
        err?.status === 401 &&
        window.location.pathname !== URL_MANAGEMENT.LOGIN
      ) {
        const hasToken = localStorage.getItem("accessToken");
        if (hasToken) {
          return await api.get(AUTH_PATH_REFRESH);
        }
        localStorage.removeItem("accessToken");
        window.location.href = URL_MANAGEMENT.LOGIN;
      }

      if (toast) {
        if (Array.isArray(rawMessage)) {
          rawMessage.forEach((msg) => {
            toast.error(i18n.t(msg), {
              autoClose: 3000,
            });
          });
        } else {
          toast!.error(i18n.t(rawMessage), {
            autoClose: 3000,
          });
        }
      }

      return Promise.reject(err.response?.data || err.message);
    } catch (error) {
      console.error("Error refreshing token:", error);
      localStorage.removeItem("accessToken");

      if (window.location.pathname !== URL_MANAGEMENT.LOGIN) {
        window.location.href = URL_MANAGEMENT.LOGIN;
      }
    }
  }
);

export const appPaginationFetcher = async <T = unknown>(
  url: string,
  params?: PaginationType,
  config = {}
) => {
  if (params) {
    const stringParams: Record<string, string> = {};
    Object.keys(params).forEach((key) => {
      const typedKey = key as keyof PaginationType;
      if (params[typedKey] !== undefined && params[typedKey] !== null) {
        stringParams[key] = String(params[typedKey]);
      }
    });
    url += `?${new URLSearchParams(stringParams).toString()}`;
  }
  return (await api.get(url, config)).data as ResponsePagination<T>["data"];
};

export const appFetcher = async <T = unknown>(url: string, config = {}) => {
  return (await api.get(url, config)).data as T;
};

export const appPoster = async <T = unknown>(
  url: string,
  data?: unknown,
  config = {}
) => {
  return (await api.post(url, data, config)) as Response<T>;
};

export const appPutter = async <T = unknown>(
  url: string,
  data?: unknown,
  config = {}
) => {
  return (await api.put<T>(url, data, config)).data;
};

export const appPatchter = async <T = unknown>(
  url: string,
  data?: unknown,
  config = {}
) => {
  return (await api.patch<T>(url, data, config)).data;
};

export const appDeleter = async <T = unknown>(
  url: string,
  data?: unknown,
  config = {}
) => {
  return (await api.delete<T>(url, { ...config, data })) as T;
};
