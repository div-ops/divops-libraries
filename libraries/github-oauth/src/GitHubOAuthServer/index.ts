import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { CorsOptions } from "../types";
import {
  createCreateResource,
  createReadResource,
  createReadResourceList,
  createDeleteResource,
  createUpdateResource,
} from "./crud";
import { createUserToken, createSetCookie } from "./login";
import { createLogout } from "./logout";
import { createUserInfo } from "./user";

export const GitHubOAuthServer = {
  of({ server, client }: { server: string; client: string }) {
    const context = { server, client };
    return {
      UserToken: withCorsOptions(context, createUserToken),
      SetCookie: withCorsOptions(context, createSetCookie),
      UserInfo: withCorsOptions(context, createUserInfo),
      Logout: withCorsOptions(context, createLogout),
      CreateResource: withCorsOptions(context, createCreateResource),
      ReadResource: withCorsOptions(context, createReadResource),
      ReadListResource: withCorsOptions(context, createReadResourceList),
      UpdateResource: withCorsOptions(context, createUpdateResource),
      DeleteResource: withCorsOptions(context, createDeleteResource),
    };
  },
};

const withCorsOptions =
  <T extends (...args: any) => any>(
    { server, client }: { server: string; client: string },
    fn: T
  ): ((options: CorsOptions) => ReturnType<T>) =>
  (options: CorsOptions) =>
    fn({ server, client, ...options });

export const GitHubOAuthRoutes = ({
  prefix,
  server,
  allowedOrigins,
}: {
  prefix: string;
  server: string;
  allowedOrigins: MiddlewareOptions["allowedOrigins"];
}) => {
  const before = createBefore({ allowedOrigins, server });

  return function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
      console.log(`[${req.method}] ${req.url}`);
      const origin = req.headers.origin;
      const { model } = { ...(req.body ?? {}), ...(req.query ?? {}) } as {
        model?: string;
      };

      if (
        model != null &&
        !isAllowed({ allowedOrigins, server }, { origin, model })
      ) {
        return res
          .status(403)
          .json({ message: "Forbidden: now allowed origin with model." });
      }

      const client = new URL(origin).hostname.replace(/\./g, "-");
      const api = GitHubOAuthServer.of({ server, client });
      const path = req.url.split("?")[0];

      switch (`[${req.method}]${path}`) {
        case `[OPTIONS]${prefix}/resource/create`:
        case `[POST]${prefix}/resource/create`: {
          return api.CreateResource({ before })(req, res);
        }
        case `[OPTIONS]${prefix}/resource/read`:
        case `[GET]${prefix}/resource/read`: {
          return api.ReadResource({ before })(req, res);
        }
        case `[OPTIONS]${prefix}/resource/readList`:
        case `[GET]${prefix}/resource/readList`: {
          return api.ReadListResource({ before })(req, res);
        }
        case `[OPTIONS]${prefix}/resource/update`:
        case `[POST]${prefix}/resource/update`: {
          return api.UpdateResource({ before })(req, res);
        }
        case `[OPTIONS]${prefix}/resource/delete`:
        case `[POST]${prefix}/resource/delete`: {
          return api.DeleteResource({ before })(req, res);
        }
        case `[OPTIONS]${prefix}/user/info`:
        case `[GET]${prefix}/user/info`: {
          return api.UserInfo({ before })(req, res);
        }
        case `[OPTIONS]${prefix}/user-token`:
        case `[POST]${prefix}/user-token`: {
          return api.UserToken({ before })(req, res);
        }
      }

      return res.status(404).json({ message: "Not Found" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  };
};

interface middleware {
  <RQ extends NextApiRequest, RS extends NextApiResponse>(
    req: RQ,
    res: RS
  ): Promise<void>;
}

interface MiddlewareOptions {
  allowedOrigins: Record<string, string[]>;
  server: string;
}

function createBefore(options: MiddlewareOptions): middleware {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const origins = Object.keys(options.allowedOrigins);

    await NextCors(req, res, {
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      origin: [...origins, "http://localhost:3000"],
      optionsSuccessStatus: 200,
      credentials: true,
    });

    await createNextAllowedAPI(options)(req, res);
  };
}

function createNextAllowedAPI(options: MiddlewareOptions): middleware {
  return async <NextApiRequest, NextApiResponse>(req, res) => {
    const { allowedOrigins } = options;
    const { model } = {
      ...req.body,
      ...req.query,
    } as { model?: string };

    const server = new URL(req.headers.origin).hostname.replace(/\./g, "-");
    const isServer = server === options.server;
    const allowedModels = allowedOrigins[req.headers.origin];

    if (isServer) {
      return;
    }

    if (allowedModels == null || !Array.isArray(allowedModels)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const isUserAPI = ["user/info", "user-token"].some((x) =>
      req.url.includes(x)
    );

    if (isUserAPI) {
      return;
    }

    if (model == null || !allowedModels.includes(model)) {
      return res.status(403).json({ message: "Forbidden" });
    }
  };
}

function isAllowed(
  options: MiddlewareOptions,
  { origin, model }: { origin: string; model: string }
) {
  console.log(`isAllowed: ${origin} ${model}`);
  const allowedModels = options.allowedOrigins[origin];
  if (allowedModels == null) {
    return false;
  }

  return (
    allowedModels.includes(model) ||
    allowedModels
      .filter((x) => x.endsWith("*"))
      .find((x) => model.startsWith(x.replace("*", "")))
  );
}
