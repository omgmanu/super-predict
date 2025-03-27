/**
 * Common interface for API responses
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * User type shared between frontend and backend
 */
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}
