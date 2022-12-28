import { Octokit } from "@octokit/rest";

export function createGistStorage({
  owner,
  name,
  token,
  baseUrl,
}: {
  owner: string;
  name: string;
  token: string;
  baseUrl;
}) {
  const octokit = new Octokit({ auth: token, baseUrl });

  return {
    set: (key: string, content: string) => {},
    get: (key: string) => {},
  };
}
