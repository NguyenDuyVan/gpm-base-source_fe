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
export const AUTH_PATH_SOCIAL_LOGIN = `/v1/auth/social-login`;
export const AUTH_PATH_ACCOUNT = `/v1/auth/current-user`;
export const AUTH_PATH_FORGOT_PASSWORD = `/v1/auth/forgot-password`;
export const AUTH_PATH_RESET_PASSWORD = `/v1/auth/reset-password`;

// Role paths
export const ROLES_PATH = `/v1/roles`;
export const ROLES_PATH_BY_ID = (id: string | number) => `/v1/roles/${id}`;

// User paths
export const USERS_PATH = `/v1/users`;
export const USERS_PATH_BY_ID = (id: string | number) => `/v1/users/${id}`;
export const USERS_PATH_CHANGE_PASSWORD = `/v1/users/change-password`;

// Blog paths
export const BLOGS_PATH = `/v1/blogs`;
export const BLOGS_PATH_BY_ID = (id: string | number) => `/v1/blogs/${id}`;
export const BLOGS_PATH_BY_SLUG = (slug: string) => `/v1/blogs/slug/${slug}`;
