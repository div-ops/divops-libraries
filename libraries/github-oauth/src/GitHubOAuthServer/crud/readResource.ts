import { createGitHubOAuth } from "../../githubOAuth";
import {
  CommonAPIOptions,
  CorsOptions,
  NextApiRequest,
  NextApiResponse,
} from "../../types";
import { getAuthorization, parseQueryStr } from "../utils";

interface Options extends CommonAPIOptions, CorsOptions {}

export function createReadResource({ server, client, before }: Options) {
  return async function readResource(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    await before(req, res);

    try {
      const model = parseQueryStr(req, "model");
      const id = parseQueryStr(req, "id");

      const cryptedGitHubId = getAuthorization(req);

      if (cryptedGitHubId == null) {
        return res.json({ data: null });
      }

      const gitHubOAuth = createGitHubOAuth({ server, client });
      const githubId = gitHubOAuth.decryptGitHubID({ cryptedGitHubId });

      const data = await gitHubOAuth.readResource({ id });

      if (data.githubId !== githubId) {
        return res.status(400).json({
          message: `${githubId}에게 ${id}의 권한이 없습니다.`,
        });
      }

      return res.json({ data });
    } catch (error: any) {
      if (error.statusCode != null) {
        return res.status(400).end(error.message);
      }

      return res.status(500).json({
        message: error.message,
      });
    }
  };
}
