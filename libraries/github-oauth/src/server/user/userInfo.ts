import { createGitHubOAuth } from "../../createGitHubOAuth";
import { CorsOptions, NextApiRequest, NextApiResponse } from "../../types";
import { getAuthorization } from "../../utils";

const cache: Record<string, any> = {};

interface Options extends CorsOptions {
  name: string;
}

export function createUserInfo({ name, before }: Options) {
  return async function userInfo(req: NextApiRequest, res: NextApiResponse) {
    await before(req, res);

    const authorization = getAuthorization(req);

    if (authorization == null) {
      return res.json({ data: null });
    }

    try {
      const gitHubOAuth = createGitHubOAuth({ name });
      const promised = gitHubOAuth
        .fetchUserInfo({
          cryptedGitHubID: authorization,
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
