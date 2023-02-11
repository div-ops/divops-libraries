import { getBaseUrl, createAuthHeaders } from "../../utils";

export async function fetchUser() {
  const response = await fetch(`${getBaseUrl()}/api/user/info`, {
    method: "GET",
    headers: {
      ...createAuthHeaders(),
    },
  });

  return await response.json();
}
