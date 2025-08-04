import { PaginationType } from "@/types/pagination";
import axios from "axios";

export type ResponsePagination<T> = {
  data: T[];
  pagination?: PaginationType;
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
  (err) => {
    // Có thể xử lý lỗi toàn cục ở đây
    const message =
      err?.response?.data?.message?.message || err.message || "Network Error";
    if (err?.status === 401 && window.location.pathname !== "/login") {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }

    console.log(message);

    // if (toast) {
    //   if (Array.isArray(message)) {
    //     message.forEach((msg) => {
    //       toast!.add({
    //         severity: "error",
    //         summary: "Lỗi",
    //         detail: msg,
    //         life: 3000,
    //       });
    //     });
    //   } else {
    //     toast!.add({
    //       severity: "error",
    //       summary: "Lỗi",
    //       detail: message,
    //       life: 3000,
    //     });
    //   }
    // }

    return Promise.reject(err.response?.data || err.message);
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
  return (await api.get(url, config)) as ResponsePagination<T>;
};

export const appFetcher = async <T = unknown>(url: string, config = {}) => {
  return (await api.get(url, config)) as T;
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
