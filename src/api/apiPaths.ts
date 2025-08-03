/**
 * API path constants
 * This file centralizes all API endpoints used in the application
 */

// Base URL
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Authentication paths
export const AUTH_PATH_LOGIN = `/v1/auth/login`;
export const AUTH_PATH_REGISTER = `/v1/auth/register`;
export const AUTH_PATH_LOGOUT = `/v1/auth/logout`;
export const AUTH_PATH_CURRENT_USER = `/v1/auth/me`;
