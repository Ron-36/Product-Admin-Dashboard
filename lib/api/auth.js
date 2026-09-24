import api from "@/lib/axios";

// All auth-related API calls live here, kept out of the UI components.
export async function login({ username, password }) {
  const { data } = await api.post("/auth/login", {
    username,
    password,
    expiresInMins: 60,
  });
  return data;
}
