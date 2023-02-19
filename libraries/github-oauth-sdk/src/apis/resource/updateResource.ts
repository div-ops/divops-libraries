import { GitHubOAuthSdkContext } from "../../types";

export async function updateResource<R, S>(
  {
    model,
    id,
    resource,
    summary,
  }: {
    model: string;
    id: string;
    resource: R;
    summary: S;
  },
  { baseUrl, getAuthorization }: GitHubOAuthSdkContext
) {
  if (model == null || model === "") {
    throw new Error(`model is "${model}"`);
  }
  if (id == null || id === "") {
    throw new Error(`id is "${id}"`);
  }

  await fetch(`${baseUrl}/api/resource/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthorization(),
    },
    body: JSON.stringify({
      id,
      model,
      resource,
      summary,
    }),
  });
}
