import { http } from "./http";

export const authApi = {
  async login(payload) {
    const { data } = await http.post("/api/auth/login", payload);

    // Ajusta o nome conforme teu AuthResponse:
    // Pode ser data.accessToken, data.token, data.access_token etc.
    const accessToken = data.accessToken || data.access_token || data.token;

    if (accessToken) localStorage.setItem("access_token", accessToken);

    return data;
  },

  async register(payload) {
    const { data } = await http.post("/api/auth/register", payload);
    return data;
  },

  async refresh() {
    const { data } = await http.post("/api/auth/refresh");
    const accessToken = data.accessToken || data.access_token || data.token;
    if (accessToken) localStorage.setItem("access_token", accessToken);
    return data;
  },

  async logout() {
    try {
      await http.post("/api/auth/logout");
    } finally {
      localStorage.removeItem("access_token");
    }
  },
};
