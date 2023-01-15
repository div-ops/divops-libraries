import { createGitHubOAuth } from "../../githubOAuth";
import {
  CorsOptions,
  NextApiRequest as Req,
  NextApiResponse as Res,
} from "../../types";
import { getAuthorization } from "../utils";

interface Options extends CorsOptions {
  name: string;
}

export function createUpdateResource({ name, before }: Options) {
  return async function updateResource(req: Req, res: Res) {
    await before(req, res);

    try {
      const model = req.body.model;
      const id = req.body.id;
      const resource = req.body.resource;
      const summary = req.body.summary;

      const cryptedGitHubId = getAuthorization(req);

      if (cryptedGitHubId == null) {
        return res.json({ data: null });
      }

      const gitHubOAuth = createGitHubOAuth({ name });
      const githubId = gitHubOAuth.decryptGitHubID({ cryptedGitHubId });

      if (githubId == null) {
        return res.status(400).json({
          message: `${githubId}에게 ${id}의 권한이 없습니다.`,
        });
      }

      await gitHubOAuth.updateResource({
        id,
        cryptedGitHubId,
        model,
        summary,
        resource,
        githubId,
      });

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
