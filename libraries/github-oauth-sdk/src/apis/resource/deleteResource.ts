import { GitHubOAuthSdkContext } from "../../types";

export async function deleteResource(
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

  await fetch(`${baseUrl}/api/resource/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthorization(),
    },
    body: JSON.stringify({
      model,
      id: id,
    }),
  });
}
