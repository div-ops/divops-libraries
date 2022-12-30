import { createGitHubOAuth } from "./createGitHubOAuth";
import { NextApiRequest, NextApiResponse } from "./types";

export function createAPIHandlerUserToken(name: string) {
  return async function loginUserTokenAPI(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const gitHubOAuth = await createGitHubOAuth({ name });

    const authorization = await gitHubOAuth.loginOauthAccessToken(
      req.body.code
    );

    res.setHeader("Authorization", `Bearer ${authorization}`);

    return res.json({ status: true });
  };
}
