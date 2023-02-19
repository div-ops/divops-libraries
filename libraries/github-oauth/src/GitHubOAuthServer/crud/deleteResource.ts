import { createGitHubOAuth } from "../../githubOAuth";
import {
  CommonAPIOptions,
  CorsOptions,
  NextApiRequest as Req,
  NextApiResponse as Res,
} from "../../types";
import { getAuthorization } from "../utils";

interface Options extends CommonAPIOptions, CorsOptions {}

export function createDeleteResource({ server, client, before }: Options) {
  return async function deleteResource(req: Req, res: Res) {
    await before(req, res);

    try {
      const model = req.body.model;
      const id = req.body.id;

      const cryptedGitHubId = getAuthorization(req);

      if (cryptedGitHubId == null) {
        return res.json({ data: null });
      }

      const gitHubOAuth = createGitHubOAuth({ server, client });
      const githubId = gitHubOAuth.decryptGitHubID({ cryptedGitHubId });

      if (githubId == null) {
        return res.status(400).json({
          message: `${githubId}에게 ${id}의 권한이 없습니다.`,
        });
      }

      await gitHubOAuth.deleteResource({ model, id, githubId });

      return res.json({ status: "ok" });
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
