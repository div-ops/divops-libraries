import { decrypt } from "@divops/simple-crypto";
import { createGitHubOAuth } from "../../githubOAuth";
import { CorsOptions, NextApiRequest, NextApiResponse } from "../../types";
import { getAuthorization } from "../utils";

interface Options extends CorsOptions {
  name: string;
}

export function createCreateResource({ name, before }: Options) {
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
      const gitHubOAuth = createGitHubOAuth({ name });
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
