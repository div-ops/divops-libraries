export function getEnvironments() {
  return {
    NODE_ENV: process.env.NODE_ENV || "production",
    hostname: process.env.HOST_NAME || "localhost",
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
    dev: process.env.SERVICE_ENV === "dev" || false,
  };
}
