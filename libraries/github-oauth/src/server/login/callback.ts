import { createGitHubOAuth } from "../../createGitHubOAuth";
import { NextApiRequest, NextApiResponse } from "../../types";

export function createCallback({ name }: { name: string }) {
  return async function callback(req: NextApiRequest, res: NextApiResponse) {
    const gitHubOAuth = await createGitHubOAuth({ name });

    return await gitHubOAuth.callback(req, res);
  };
}
