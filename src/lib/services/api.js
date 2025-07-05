import axios from "axios";
import { browser } from "$app/environment";
import { goto } from "$app/navigation";

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (browser) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response && response.status === 401) {
      if (browser) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        goto("/auth/login");
      }
    }

    return Promise.reject(error);
  }
);

const FIELDS_TO_REMOVE = ["_id", "__v", "createdAt", "updatedAt"];

const sanitizeData = (data) => {
  if (!data || typeof data !== "object") {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item));
  }

  const sanitized = {};

  Object.entries(data).forEach(([key, value]) => {
    if (FIELDS_TO_REMOVE.includes(key)) {
      return;
    }

    if (value !== null && typeof value === "object") {
      sanitized[key] = sanitizeData(value);
    } else if (value !== undefined && value !== null) {
      sanitized[key] = value;
    }
  });

  return sanitized;
};

api.interceptors.request.use(
  (config) => {
    if (
      ["post", "put", "patch"].includes(config.method?.toLowerCase()) &&
      config.data &&
      !(config.data instanceof FormData)
    ) {
      const sanitizedData = sanitizeData(
        JSON.parse(JSON.stringify(config.data))
      );
      config.data = sanitizedData;

      if (import.meta.env.DEV) {
        console.log(
          `Sanitized data for ${config.method?.toUpperCase()} ${config.url}:`,
          sanitizedData
        );
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.request.use(
  (config) => {
    if (browser) {
      const token = localStorage.getItem("token");
      if (token) {
        console.log(
          "🔑 Token encontrado no localStorage:",
          token.substring(0, 20) + "..."
        );
        console.log(
          "📨 Enviando requisição para:",
          config.url,
          "com método:",
          config.method
        );
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn("⚠️ Nenhum token encontrado no localStorage!");
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log("✅ Resposta recebida com status:", response.status);
    return response;
  },
  (error) => {
    console.error(
      "❌ Erro na requisição:",
      error.response?.status,
      error.response?.data
    );
    return Promise.reject(error);
  }
);

export default api;
