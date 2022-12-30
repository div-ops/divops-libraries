export function guardBrowserEnvironment() {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    throw new Error("브라우저 환경이 아닙니다.");
  }
}
