import { GitHubOAuthSdkContext } from "../../types";

export async function readResources(
  {
    model,
    pageNo = 1,
    pageSize = 10,
  }: {
    model: string;
    pageNo?: number;
    pageSize?: number;
  },
  { baseUrl, getAuthorization }: GitHubOAuthSdkContext
) {
  if (model == null || model === "") {
    throw new Error(`model is "${model}"`);
  }

  const response = await fetch(
    `${baseUrl}/api/resource/readList?model=${model}&pageNo=${pageNo}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: {
        Authorization: getAuthorization(),
      },
    }
  );

  return await response.json();
}
