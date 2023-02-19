import { createGitHubOAuth } from "../../githubOAuth";
import {
  CommonAPIOptions,
  CorsOptions,
  NextApiRequest,
  NextApiResponse,
} from "../../types";

interface Options extends CommonAPIOptions, CorsOptions {}

export function createUserToken({ server, client, before }: Options) {
  return async function loginUserTokenAPI(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    await before(req, res);

    const gitHubOAuth = createGitHubOAuth({ server, client });

    const authorization = await gitHubOAuth.loginOauthAccessToken(
      req.body.code
    );

    res.setHeader("Authorization", `${authorization}`);

    return res.end();
  };
}
