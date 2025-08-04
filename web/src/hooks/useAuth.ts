import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { api } from "../lib/axios";

export interface JWTPayload {
  role: "SITE_MANAGER" | "DRIVER" | "ADMIN";
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("access"),
  );

  async function login(phone: string, password: string) {
    const { data } = await api.post("/token/", {
      phone_number: phone,
      password,
    });
    setToken(data.access);
    localStorage.setItem("access", data.access);
    api.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;

    const { role } = jwtDecode<JWTPayload>(data.access);
    localStorage.setItem("role", role);
  }

  function logout() {
    setToken(null);
    localStorage.removeItem("access");
    localStorage.removeItem("role");
    delete api.defaults.headers.common["Authorization"];
  }

  return { token, login, logout };
}
