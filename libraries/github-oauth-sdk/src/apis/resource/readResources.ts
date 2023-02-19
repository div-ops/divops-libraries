import { GitHubOAuthSdkContext } from "../../types";

export async function readResources(
  {
    model,
    pageNo = 1,
  }: {
    model: string;
    pageNo?: number;
  },
  { baseUrl, getAuthorization }: GitHubOAuthSdkContext
) {
  if (model == null || model === "") {
    throw new Error(`model is "${model}"`);
  }

  const response = await fetch(
    `${baseUrl}/api/resource/readList?model=${model}&pageNo=${pageNo}`,
    {
      method: "GET",
      headers: {
        Authorization: getAuthorization(),
      },
    }
  );

  return await response.json();
}
