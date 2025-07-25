import { fetchApi } from "./apiClient";

interface ContentResponse {
  message: string;
}

export const getContent = async (): Promise<ContentResponse> => {
  return fetchApi<ContentResponse>("/");
};
