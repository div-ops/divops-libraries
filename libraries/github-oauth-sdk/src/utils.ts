import { BaseUrls, DefaultBaseUrl } from "./constants";

export function createAuthHeaders(): { Authorization?: string } {
  try {
    guardBrowserEnvironment();

    const Authorization = localStorage.getItem("authorization");
    if (Authorization != null) {
      return { Authorization };
    } else {
      return {};
    }
  } catch {
    return {};
  }
}

export const getBaseUrl = () => {
  if (typeof window === "undefined") {
    return DefaultBaseUrl;
  }

  if (BaseUrls[window.location.hostname] != null) {
    return BaseUrls[window.location.hostname];
  }

  return "";
};

export function guardBrowserEnvironment() {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    throw new Error("브라우저 환경이 아닙니다.");
  }
}
