import { createGitHubOAuth } from "../../createGitHubOAuth";
import { NextApiRequest, NextApiResponse } from "../../types";

export function createUserInfo({ name }: { name: string }) {
  return async function userInfo(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { authorization } = req.cookies;
      const gitHubOAuth = await createGitHubOAuth({ name });

      const decoded = Buffer.from(authorization, "base64").toString("utf8");

      return res.json({
        data: await gitHubOAuth.fetchUserInfo({
          cryptedGitHubID: decodeURIComponent(decoded),
        }),
      });
    } catch (error: any) {
      return res.json({
        message: error.message,
      });
    }
  };
}
