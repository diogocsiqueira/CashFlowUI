import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const http = axios.create({
  baseURL,
  timeout: 10000,

  // IMPORTANTE pra cookie HttpOnly (refresh_token)
  withCredentials: true,
});

// ---- request: injeta Bearer token ----
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- response: se 401 tenta refresh 1x e repete request ----
http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error?.response?.status === 401 && !original?._retry) {
      original._retry = true;
      try {
        const r = await http.post("/api/auth/refresh");
        const data = r.data || {};
        const accessToken = data.accessToken || data.access_token || data.token;
        if (accessToken) localStorage.setItem("access_token", accessToken);

        // repete request original
        return http(original);
      } catch (e) {
        localStorage.removeItem("access_token");
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);




// --- helpers token ---
const TOKEN_KEY = "caixa_access_token";

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// --- Request interceptor: injeta Bearer ---
http.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
