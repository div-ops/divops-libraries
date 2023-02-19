import { GitHubOAuthSdkContext } from "../../types";

export async function fetchUser({
  baseUrl,
  getAuthorization,
}: GitHubOAuthSdkContext) {
  const response = await fetch(`${baseUrl}/api/user/info`, {
    method: "GET",
    headers: {
      Authorization: getAuthorization(),
    },
  });

  return await response.json();
}
