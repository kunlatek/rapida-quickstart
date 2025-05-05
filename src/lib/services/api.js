import axios from "axios";
import { browser } from "$app/environment";
import { goto } from "$app/navigation";

// Create the axios instance
const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    // Handle unauthorized access
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

// Fields to remove from requests
const FIELDS_TO_REMOVE = ["_id", "__v", "createdAt", "updatedAt"];

// Recursive function to sanitize data
const sanitizeData = (data) => {
  // Handle null or non-object values
  if (!data || typeof data !== "object") {
    return data;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item));
  }

  // Handle objects
  const sanitized = {};

  Object.entries(data).forEach(([key, value]) => {
    // Skip fields that should be removed
    if (FIELDS_TO_REMOVE.includes(key)) {
      return;
    }

    // Recursively sanitize nested objects
    if (value !== null && typeof value === "object") {
      sanitized[key] = sanitizeData(value);
    } else if (value !== undefined && value !== null) {
      sanitized[key] = value;
    }
  });

  return sanitized;
};

// Add request interceptor for automatic data sanitization
api.interceptors.request.use(
  (config) => {
    // Only sanitize data for methods that send a body (POST, PUT, PATCH)
    if (
      ["post", "put", "patch"].includes(config.method?.toLowerCase()) &&
      config.data
    ) {
      // Clone the data to avoid mutating the original
      const sanitizedData = sanitizeData(
        JSON.parse(JSON.stringify(config.data))
      );
      config.data = sanitizedData;

      // Optional: Log sanitized data in development
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

export default api;
