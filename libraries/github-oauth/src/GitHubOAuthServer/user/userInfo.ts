import { createGitHubOAuth } from "../../githubOAuth";
import {
  CommonAPIOptions,
  CorsOptions,
  NextApiRequest,
  NextApiResponse,
} from "../../types";
import { getAuthorization } from "../utils";

const cache: Record<string, any> = {};

interface Options extends CommonAPIOptions, CorsOptions {}

export function createUserInfo({ server, client, before }: Options) {
  return async function userInfo(req: NextApiRequest, res: NextApiResponse) {
    await before(req, res);

    const authorization = getAuthorization(req);

    if (authorization == null) {
      return res.json({ data: null });
    }

    try {
      const gitHubOAuth = createGitHubOAuth({ server, client });
      const promised = gitHubOAuth
        .fetchUserInfo({
          cryptedGitHubId: authorization,
        })
        .then((x) => {
          cache[authorization] = x;
          return x;
        });

      if (cache[authorization] != null) {
        return res.json({
          data: cache[authorization],
        });
      }

      return res.json({
        data: await promised,
      });
    } catch (error: any) {
      return res.json({
        message: error.message,
      });
    }
  };
}
