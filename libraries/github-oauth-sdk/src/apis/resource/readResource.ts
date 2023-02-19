import { GitHubOAuthSdkContext } from "../../types";

export async function readResource(
  {
    model,
    id,
  }: {
    model: string;
    id: string;
  },
  { baseUrl, getAuthorization }: GitHubOAuthSdkContext
) {
  if (model == null || model === "") {
    throw new Error(`model is "${model}"`);
  }
  if (id == null || id === "") {
    throw new Error(`id is "${id}"`);
  }

  const response = await fetch(
    `${baseUrl}/api/resource/read?model=${model}&id=${id}`,
    {
      method: "GET",
      headers: {
        Authorization: getAuthorization(),
      },
    }
  );

  return await response.json();
}
