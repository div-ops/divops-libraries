import { createGitHubOAuth } from "../../createGitHubOAuth";
import { CorsOptions, NextApiRequest, NextApiResponse } from "../../types";

interface Options extends CorsOptions {
  name: string;
}

export function createUserToken({ name, before }: Options) {
  return async function loginUserTokenAPI(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    await before(req, res);

    const gitHubOAuth = createGitHubOAuth({ name });

    const authorization = await gitHubOAuth.loginOauthAccessToken(
      req.body.code
    );

    res.setHeader("Authorization", `${authorization}`);

    return res.end();
  };
}
