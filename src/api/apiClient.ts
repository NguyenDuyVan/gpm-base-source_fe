import { ApiException } from "@/utils/errorHandler";
import { useAuthStore } from "@/store/authStore";

// API base client setup
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface ApiClientOptions extends RequestInit {
  requireAuth?: boolean;
  params?: Record<string, string | number | boolean | undefined | null>;
}

/**
 * Fetch data from API with error handling and authentication
 */
export async function fetchApi<T>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const { requireAuth = false, params, ...fetchOptions } = options;

  // Build URL with query parameters
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const queryString = queryParams.toString();
    if (queryString) {
      url = `${url}${url.includes("?") ? "&" : "?"}${queryString}`;
    }
  }

  // Prepare headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  // Add auth token if required
  if (requireAuth) {
    const token = useAuthStore.getState().token;
    if (!token) {
      throw new ApiException("Authentication required", 401);
    }
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Make request
  let response: Response;
  try {
    response = await fetch(url, {
      ...fetchOptions,
      headers,
    });
  } catch (error) {
    throw new ApiException("Network error", 0);
  }

  // Handle error responses
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      // If JSON parsing fails, use text
      const text = await response.text();
      errorData = { message: text || "Unknown error" };
    }

    throw new ApiException(
      errorData.message || `API Error: ${response.status}`,
      response.status,
      errorData
    );
  }

  // Return successful response
  return await response.json();
}
