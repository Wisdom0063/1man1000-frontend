import Axios, { AxiosRequestConfig } from "axios";

export const AXIOS_INSTANCE = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:6004",
});

// Add auth token interceptor
AXIOS_INSTANCE.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const storage = localStorage.getItem("auth-storage");
    if (storage) {
      try {
        const parsed = JSON.parse(storage);
        const token = parsed.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // Invalid JSON, ignore
      }
    }
  }
  return config;
});

// Custom mutator function for Orval
export const axiosInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-expect-error - Adding cancel method to promise
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};

export default axiosInstance;
