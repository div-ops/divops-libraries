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

export class BadRequestError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function parseQueryStr(
  req: NextApiRequest,
  name: string,
  defaultValue?: string
): string {
  const value = req.query[name];

  if (value == null) {
    if (defaultValue == null) {
      throw new BadRequestError(400, `${name} is required`);
    }

    return defaultValue;
  }

  if (Array.isArray(value)) {
    throw new BadRequestError(400, `${name} is not allowed Array.`);
  }

  return value;
}

export function parseQueryNumber(
  req: NextApiRequest,
  name: string,
  defaultValue?: number
): number {
  const value = req.query[name];

  if (value == null) {
    return defaultValue;
  }

  if (Array.isArray(value)) {
    throw new BadRequestError(400, `${name} is not allowed Array.`);
  }

  return Number(value);
}
