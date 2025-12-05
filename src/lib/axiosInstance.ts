import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { SessionManager } from "./session";
import type { ApiResponseType, AuthData } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default axios.create({
  baseURL: API_BASE_URL,
});

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

export interface PrivateAxiosRequestConfig extends InternalAxiosRequestConfig {
  _requiresAuth?: boolean;
  _retryCount?: number;
  _didRefresh?: boolean;
}

const MAX_RETRIES = 3;

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const privateConfig = config as PrivateAxiosRequestConfig;

    const token = SessionManager.getCookie("token");
    if (token) {
      privateConfig.headers["Authorization"] = `Bearer ${token}`;
    }

    if (privateConfig.data instanceof FormData) {
      privateConfig.headers["Content-Type"] = "multipart/form-data";
    }

    return privateConfig;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const config = error.config as PrivateAxiosRequestConfig;

    // Handle network errors
    if (!error.response?.status) {
      return Promise.reject(
        new Error(
          "Network error: Please check your internet connection and try again."
        )
      );
    }

    // Handle 500 errors
    if (error.response?.status === 500) {
      return Promise.reject(
        new Error(
          error.response.data.error ||
            error.response.data.message ||
            "Please try again later"
        )
      );
    }

    // Handle 403 errors (Forbidden)
    if (error.response?.status === 403) {
      return Promise.reject(
        new Error(
          error.response.data.error ||
            error.response.data.message ||
            "Please try again later"
        )
      );
    }

    // Handle non-401 errors
    if (error.response?.status !== 401) {
      return Promise.reject(error.response.data);
    }

    // Handle 401 errors
    if (error.response?.status === 401) {
      config._retryCount = config._retryCount || 0;

      if (config._retryCount < MAX_RETRIES) {
        config._retryCount++;

        try {
          const refreshToken = SessionManager.getCookie("refresh_token");
          if (!refreshToken) {
            SessionManager.logoutCookie();
            return Promise.reject(new Error("No refresh token available"));
          }

          const tokenResponse = await axios.post<ApiResponseType<AuthData>>(
            `${API_BASE_URL}/auth/refresh`,
            { refreshToken }
          );

          const newAccessToken = tokenResponse.data.data.access_token;
          if (newAccessToken && tokenResponse.status === 200) {
            await SessionManager.loginCookie(tokenResponse.data.data);
            config.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosInstance(config); // Retry the original request
          } else {
            SessionManager.logoutCookie();
            return Promise.reject(new Error("Token refresh failed"));
          }
        } catch (refreshError) {
          SessionManager.logoutCookie();
          return Promise.reject(refreshError);
        }
      } else {
        // Max retries reached, log out
        SessionManager.logoutCookie();
        return Promise.reject(
          new Error("Max retries reached for token refresh")
        );
      }
    }

    return Promise.reject(error.response || error);
  }
);
