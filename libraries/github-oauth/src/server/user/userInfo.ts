import { createGitHubOAuth } from "../../createGitHubOAuth";
import { NextApiRequest, NextApiResponse } from "../../types";

export function createUserInfo({ name }: { name: string }) {
  return async function userInfo(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { authorization } = req.cookies;
      console.log("req.cookies", req.cookies);
      console.log("req.cookies.authorization", authorization);
      const gitHubOAuth = await createGitHubOAuth({ name });

      console.log("req.cookies.authorization", authorization);

      const decoded = Buffer.from(authorization, "base64").toString("utf8");

      return res.json({
        data: await gitHubOAuth.fetchUserInfo({
          accessTokenKey: decodeURIComponent(decoded),
        }),
      });
    } catch (error: any) {
      return res.json({
        message: error.message,
      });
    }
  };
}
