import { createGitHubOAuth } from "../../githubOAuth";
import { CorsOptions, NextApiRequest, NextApiResponse } from "../../types";
import { getAuthorization, parseQueryNumber, parseQueryStr } from "../utils";

interface Options extends CorsOptions {
  name: string;
}

export function createReadResourceList({ name, before }: Options) {
  return async function readResourceList(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    await before(req, res);

    try {
      const model = parseQueryStr(req, "model");
      const pageNo = parseQueryNumber(req, "pageNo", 1);
      const pageSize = parseQueryNumber(req, "pageSize", 10);

      const cryptedGitHubId = getAuthorization(req);

      if (cryptedGitHubId == null) {
        return res.json({ data: null });
      }

      const gitHubOAuth = createGitHubOAuth({ name });
      const githubId = gitHubOAuth.decryptGitHubID({ cryptedGitHubId });

      const { totalCount, data } = await gitHubOAuth.readResourceList({
        model,
        githubId,
      });

      return res.json({
        totalCount,
        data: data.slice((pageNo - 1) * pageSize, pageNo * pageSize),
      });
    } catch (error: any) {
      if (error.statusCode != null) {
        return res.status(400).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: error.message,
      });
    }
  };
}
