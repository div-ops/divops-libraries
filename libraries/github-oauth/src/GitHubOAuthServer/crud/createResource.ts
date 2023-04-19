import { decrypt } from "@divops/simple-crypto";
import { createGitHubOAuth } from "../../githubOAuth";
import {
  CommonAPIOptions,
  CorsOptions,
  NextApiRequest,
  NextApiResponse,
} from "../../types";
import { getAuthorization } from "../utils";

interface Options extends CommonAPIOptions, CorsOptions {}

export function createCreateResource({ server, client, before }: Options) {
  return async function createResource(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const start = Date.now();
    console.log(`[CreateResource] 1 STEP: ${start - Date.now()}ms`);
    await before(req, res);
    console.log(`[CreateResource] 2 STEP: ${start - Date.now()}ms`);

    const model = req.body.model;
    const resource = req.body.resource;
    const summary = req.body.summary;

    const cryptedGitHubId = getAuthorization(req);
    console.log(`[CreateResource] 3 STEP: ${start - Date.now()}ms`);

    if (cryptedGitHubId == null) {
      return res.json({ data: null });
    }

    try {
      const gitHubOAuth = createGitHubOAuth({ server, client });
      console.log(`[CreateResource] 4 STEP: ${start - Date.now()}ms`);
      const githubId = gitHubOAuth.decryptGitHubID({ cryptedGitHubId });
      console.log(`[CreateResource] 5 STEP: ${start - Date.now()}ms`);

      await gitHubOAuth.createResource({
        cryptedGitHubId,
        model,
        summary,
        resource,
        githubId,
      });
      console.log(`[CreateResource] 6 STEP: ${start - Date.now()}ms`);

      return res.end();
    } catch (error: any) {
      return res.json({
        message: error.message,
      });
    }
  };
}
