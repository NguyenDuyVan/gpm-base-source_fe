export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

export class ApiException extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiException";
    this.status = status;
    this.data = data;
  }
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof ApiException) {
    return {
      message: error.message,
      status: error.status,
      data: error.data,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message || "An unknown error occurred",
    };
  }

  return {
    message: "An unknown error occurred",
  };
}
