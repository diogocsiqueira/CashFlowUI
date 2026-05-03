import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const http = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true,
});

// ===== Token helpers =====
const TOKEN_KEY = "access_token";

function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setAccessToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function isAuthRoute(url = "") {
  return (
    url.includes("/api/auth/login") ||
    url.includes("/api/auth/register") ||
    url.includes("/api/auth/refresh") ||
    url.includes("/api/auth/logout")
  );
}

// ===== Request interceptor =====
http.interceptors.request.use((config) => {
  const token = getAccessToken();
  const url = config.url || "";

  // NÃO manda Bearer nas rotas de auth.
  // Principalmente no refresh, senão token expirado pode atrapalhar.
  if (token && !isAuthRoute(url)) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ===== Refresh control =====
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });

  failedQueue = [];
}

// ===== Response interceptor =====
http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (!original) {
      return Promise.reject(error);
    }

    const status = error?.response?.status;
    const url = original.url || "";

    const shouldTryRefresh =
      (status === 401 || status === 403) &&
      !original._retry &&
      !isAuthRoute(url);

    if (!shouldTryRefresh) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${token}`;
        return http(original);
      });
    }

    isRefreshing = true;

    try {
      const r = await http.post("/api/auth/refresh");
      const data = r.data || {};

      const accessToken =
        data.accessToken || data.access_token || data.token;

      if (!accessToken) {
        throw new Error("Refresh não retornou access token");
      }

      setAccessToken(accessToken);

      original.headers = original.headers || {};
      original.headers.Authorization = `Bearer ${accessToken}`;

      processQueue(null, accessToken);

      return http(original);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearAccessToken();

      // opcional, mas recomendado:
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);