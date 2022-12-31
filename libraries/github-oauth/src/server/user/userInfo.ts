import { createGitHubOAuth } from "../../createGitHubOAuth";
import { NextApiRequest, NextApiResponse } from "../../types";

export function createUserInfo({ name }: { name: string }) {
  return async function userInfo(req: NextApiRequest, res: NextApiResponse) {
    const { authorization } = req.cookies;
    const gitHubOAuth = await createGitHubOAuth({ name });

    return res.json({
      data: await gitHubOAuth.fetchUserInfo({ accessTokenKey: authorization }),
    });
  };
}
