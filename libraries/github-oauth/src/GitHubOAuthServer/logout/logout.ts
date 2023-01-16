import { CorsOptions, NextApiRequest, NextApiResponse } from "../../types";

export function createLogout({ before }: CorsOptions) {
  return async function logout(req: NextApiRequest, res: NextApiResponse) {
    await before(req, res);

    res.setHeader(
      "Set-Cookie",
      `authorization=deleted; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
    );

    return res.end();
  };
}
