import { CorsOptions, NextApiRequest, NextApiResponse } from "../../types";

export function createSetCookie({ before }: CorsOptions) {
  return async function setCookie(req: NextApiRequest, res: NextApiResponse) {
    await before(req, res);

    const authorization = req.headers?.["authorization"];

    if (authorization == null) {
      return res.status(400).json({ message: "권한이 없습니다." });
    }

    res.setHeader(
      "Set-Cookie",
      `authorization=${authorization}; Path=/; SameSite=None; Secure;`
    );

    return res.end();
  };
}
