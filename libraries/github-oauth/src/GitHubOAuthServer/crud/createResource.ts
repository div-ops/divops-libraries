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
    await before(req, res);

    const model = req.body.model;
    const resource = req.body.resource;
    const summary = req.body.summary;

    const cryptedGitHubId = getAuthorization(req);

    if (cryptedGitHubId == null) {
      return res.json({ data: null });
    }

    try {
      const gitHubOAuth = createGitHubOAuth({ server, client });
      const githubId = gitHubOAuth.decryptGitHubID({ cryptedGitHubId });

      await gitHubOAuth.createResource({
        cryptedGitHubId,
        model,
        summary,
        resource,
        githubId,
      });

      return res.end();
    } catch (error: any) {
      return res.json({
        message: error.message,
      });
    }
  };
}
