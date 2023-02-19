import { GitHubOAuthSdkContext } from "../../types";

export async function createResource<R, S>(
  {
    model,
    resource,
    summary,
  }: {
    model: string;
    resource: R;
    summary: S;
  },
  { baseUrl, getAuthorization }: GitHubOAuthSdkContext
) {
  if (model == null || model === "") {
    throw new Error(`model is "${model}"`);
  }

  await fetch(`${baseUrl}/api/resource/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthorization(),
    },
    body: JSON.stringify({
      model,
      resource,
      summary,
    }),
  });
}
