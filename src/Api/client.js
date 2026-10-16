import axios from "axios";

// Shared HTTP client for the backend.
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://route-posts.routemisr.com";

const client = axios.create({
  baseURL: API_BASE_URL,
});

// The API authenticates with a `token` header (not `Authorization: Bearer`).
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.token = token;
  }
  return config;
});

export default client;
