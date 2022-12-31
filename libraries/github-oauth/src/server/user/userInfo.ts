import { createGitHubOAuth } from "../../createGitHubOAuth";
import { NextApiRequest, NextApiResponse } from "../../types";

const cache: Record<string, any> = {};

export function createUserInfo({ name }: { name: string }) {
  return async function userInfo(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { authorization } = req.cookies;
      const gitHubOAuth = createGitHubOAuth({ name });
      const promised = gitHubOAuth
        .fetchUserInfo({
          cryptedGitHubID: decodeURIComponent(authorization),
        })
        .then((x) => {
          cache[decodeURIComponent(authorization)] = x;
          return x;
        });

      if (cache[decodeURIComponent(authorization)] != null) {
        return res.json({
          data: cache[decodeURIComponent(authorization)],
        });
      }

      // const decoded = Buffer.from(authorization, "base64").toString("utf8");

      return res.json({
        data: await promised,
      });
    } catch (error: any) {
      return res.json({
        message: error.message,
      });
    }
  };
}
