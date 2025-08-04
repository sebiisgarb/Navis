import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// this must be *before* any request is sent
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  console.log("[axios] attaching token:", token); // ← add this
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});
