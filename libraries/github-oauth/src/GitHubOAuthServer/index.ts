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
  of({ name }: { name: string }) {
    return {
      UserToken: withCorsOptions(name, createUserToken),
      SetCookie: withCorsOptions(name, createSetCookie),
      UserInfo: withCorsOptions(name, createUserInfo),
      Logout: withCorsOptions(name, createLogout),
      CreateResource: withCorsOptions(name, createCreateResource),
      ReadResource: withCorsOptions(name, createReadResource),
      ReadListResource: withCorsOptions(name, createReadResourceList),
      UpdateResource: withCorsOptions(name, createUpdateResource),
      DeleteResource: withCorsOptions(name, createDeleteResource),
    };
  },
};

const withCorsOptions =
  <T extends (...args: any) => any>(
    name: string,
    fn: T
  ): ((options: CorsOptions) => ReturnType<T>) =>
  (options: CorsOptions) =>
    fn({ name, ...options });

export const GitHubOAuthRoutes = ({
  origins,
  prefix,
  name,
}: {
  origins: string[];
  prefix: string;
  name: string;
}) => {
  return function handler(req: NextApiRequest, res: NextApiResponse) {
    const server = GitHubOAuthServer.of({ name: name });
    const before = createCors();

    switch (`[${req.method}]${req.url}`) {
      case `[OPTIONS]${prefix}/resource/create`:
      case `[POST]${prefix}/resource/create`: {
        return server.CreateResource({ before })(req, res);
      }
      case `[OPTIONS]${prefix}/resource/read`:
      case `[GET]${prefix}/resource/read`: {
        return server.ReadResource({ before })(req, res);
      }
      case `[OPTIONS]${prefix}/resource/readList`:
      case `[GET]${prefix}/resource/readList`: {
        return server.ReadListResource({ before })(req, res);
      }
      case `[OPTIONS]${prefix}/resource/update`:
      case `[POST]${prefix}/resource/update`: {
        return server.UpdateResource({ before })(req, res);
      }
      case `[OPTIONS]${prefix}/resource/delete`:
      case `[POST]${prefix}/resource/delete`: {
        return server.DeleteResource({ before })(req, res);
      }
      case `[OPTIONS]${prefix}/user/info`:
      case `[GET]${prefix}/user/info`: {
        return server.UserInfo({ before })(req, res);
      }
      case `[OPTIONS]${prefix}/user-token`:
      case `[POST]${prefix}/user-token`: {
        return server.UserToken({ before })(req, res);
      }
    }

    res.setHeader(
      "debugging-message",
      JSON.stringify({
        method: req.method,
        url: req.url,
      })
    );
    return res.status(404).json({ message: "Not Found" });
  };
};

function createCors({ origins = [] }: { origins?: string[] } = {}) {
  return async <RQ, RS>(req: RQ, res: RS) => {
    await NextCors(req as NextApiRequest, res as NextApiResponse, {
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      origin: [...origins, "http://localhost:3000"],
      optionsSuccessStatus: 200,
      credentials: true,
    });
  };
}
