import { createGitHubOAuth } from "../../githubOAuth";
import {
  CommonAPIOptions,
  CorsOptions,
  NextApiRequest as Req,
  NextApiResponse as Res,
} from "../../types";
import { getAuthorization } from "../utils";

interface Options extends CommonAPIOptions, CorsOptions {}

export function createUpdateResource({ server, client, before }: Options) {
  return async function updateResource(req: Req, res: Res) {
    const start = Date.now();
    console.log(`[UreateResource] 1 STEP: ${Date.now() - start}ms`);
    await before(req, res);
    console.log(`[UreateResource] 2 STEP: ${Date.now() - start}ms`);

    try {
      const model = req.body.model;
      const id = req.body.id;
      const resource = req.body.resource;
      const summary = req.body.summary;

      const cryptedGitHubId = getAuthorization(req);
      console.log(`[UreateResource] 3 STEP: ${Date.now() - start}ms`);

      if (cryptedGitHubId == null) {
        return res.json({ data: null });
      }

      const gitHubOAuth = createGitHubOAuth({ server, client });
      console.log(`[UreateResource] 4 STEP: ${Date.now() - start}ms`);
      const githubId = gitHubOAuth.decryptGitHubID({ cryptedGitHubId });
      console.log(`[UreateResource] 5 STEP: ${Date.now() - start}ms`);

      if (githubId == null) {
        return res.status(400).json({
          message: `${githubId}에게 ${id}의 권한이 없습니다.`,
        });
      }
      console.log(`[UreateResource] 6 STEP: ${Date.now() - start}ms`);

      await gitHubOAuth.updateResource({
        id,
        cryptedGitHubId,
        model,
        summary,
        resource,
        githubId,
      });
      console.log(`[UreateResource] 7 STEP: ${Date.now() - start}ms`);

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
