import { OpenAPI } from "@workspace/client";

export function initializeApi() {
  OpenAPI.BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6004";
  OpenAPI.TOKEN = async () => {
    if (typeof window !== "undefined") {
      const storage = localStorage.getItem("auth-storage");
      if (storage) {
        const parsed = JSON.parse(storage);
        return parsed.state?.token || "";
      }
    }
    return "";
  };
}
