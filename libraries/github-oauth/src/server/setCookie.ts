import { NextApiRequest, NextApiResponse } from "../types";

export interface SetCookieOptions {
  before: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
}

export function createSetCookie({ before }: SetCookieOptions) {
  return async function setCookie(req: NextApiRequest, res: NextApiResponse) {
    await before(req, res);

    const authorization = req.headers?.["authorization"];

    if (authorization == null) {
      return res.status(400).json({ message: "권한이 없습니다." });
    }

    const decoded = decodeURIComponent(authorization);
    const [, token] = decoded.split(" ");

    res.setHeader("Set-Cookie", `token=${token}; Path=/;`);

    return res.json({ status: true });
  };
}
