import axios from "axios";

// One shared Axios instance for the whole app.
// - request interceptor: attaches the login token to every call
// - response interceptor: normalises errors into a single shape
//   so every screen can handle them the same way
const api = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Turn whatever Axios/DummyJSON throws into one predictable shape:
    // { status, message }. Every caller can rely on this instead of
    // digging through error.response / error.request / error.message.
    let status = null;
    let message = "Something went wrong. Please try again.";

    if (error.response) {
      status = error.response.status;
      message =
        error.response.data?.message ||
        error.response.data?.error ||
        `Request failed with status ${status}.`;

      if (status === 401) {
        message = "Your session has expired. Please log in again.";
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");
          if (!window.location.pathname.startsWith("/login")) {
            window.location.href = "/login";
          }
        }
      }
    } else if (error.request) {
      message = "No response from the server. Check your connection.";
    } else if (error.message) {
      message = error.message;
    }

    return Promise.reject({ status, message, original: error });
  }
);

export default api;
