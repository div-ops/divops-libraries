import { NextApiRequest, NextApiResponse } from "../../types";

export function createUserInfo({ name }: { name: string }) {
  return async function userInfo(req: NextApiRequest, res: NextApiResponse) {
    const { authorization } = req.cookies;

    return res.json({
      name,
      authorization: authorization.length,
      a: authorization.split("")[0],
    });
  };
}
