import { NextApiRequest } from "../types";

export function getAuthorization(req: NextApiRequest): string | null {
  const authorization = (() => {
    try {
      return req.cookies?.authorization ?? req.headers?.authorization ?? null;
    } catch {
      if (req.headers?.authorization === "") {
        return null;
      }

      return req.headers?.authorization ?? null;
    }
  })();
  if (authorization == null) {
    return null;
  }

  return decodeURIComponent(authorization);
}
