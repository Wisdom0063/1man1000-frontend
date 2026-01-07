import axios from "axios";

export function initializeApi() {
  // Set base URL for all axios requests
  axios.defaults.baseURL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:6004";

  // Add auth token interceptor
  axios.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
      const storage = localStorage.getItem("auth-storage");
      if (storage) {
        const parsed = JSON.parse(storage);
        const token = parsed.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
    return config;
  });
}
