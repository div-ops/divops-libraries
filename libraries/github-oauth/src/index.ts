import axios from "axios";
import { IncomingMessage, ServerResponse } from "http";
import path from "path";

function parseCookie(cookieString: string): Record<string, string | null> {
  return cookieString
    ?.split(";")
    .map((x) => x.trim().split("="))
    .reduce((acc, [key, value]) => {
      return {
        ...acc,
        ...(key != null && value != null ? { [key]: value } : {}),
      };
    }, {});
}

function getQueryFromUrl(url: string) {
  if (!url.includes("?")) {
    return {};
  }

  const querystring = url.slice(url.indexOf("?") + 1);
  return querystring.split("&").reduce((acc, cur) => {
    const [key, value] = cur.split("=");
    if (key != null && value != null) {
      return {
        ...acc,
        [key]: value,
      };
    }

    return acc;
  }, {});
}

export const createGitHubOAuth = ({
  CLIENT_ID = process.env.GITHUB_CLIENT_ID,
  CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET,
  CALLBACK_URL = "referer",
  OAUTH_COOKIE_KEY = "github-oauth",
  LOGIN_URL = "/login/github",
}: {
  CLIENT_ID?: string;
  CLIENT_SECRET?: string;
  CALLBACK_URL?: string;
  OAUTH_COOKIE_KEY?: string;
  LOGIN_URL?: string;
} = {}) => {
  return {
    /**
     * @name redirectToGitHubAuthPage
     * @example
     * const referer = req.headers.referer;
     *
     * if (req.headers.referer != null) {
     *   res.setHeader(
     *     "Set-Cookie",
     *     `${CALLBACK_URL}=${referer}; Path=/; HttpOnly; Secure; SameSite=None;`
     *   );
     * }
     */
    redirectToGitHubAuthPage: (req: IncomingMessage, res: ServerResponse) => {
      // const referer = req.headers.referer;

      // if (req.headers.referer != null) {
      //   res.setHeader(
      //     "Set-Cookie",
      //     `${CALLBACK_URL}=${referer}; Path=/; HttpOnly; Secure; SameSite=None;`
      //   );
      // }

      return {
        redirect: {
          destination: `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`,
          permanent: false,
        },
      };
    },

    findGitHubToken: (req: IncomingMessage) => {
      const cookies = parseCookie(req.headers["cookie"]);

      return cookies[OAUTH_COOKIE_KEY];
    },

    callback: async (req: IncomingMessage, res: ServerResponse) => {
      try {
        const { code } = getQueryFromUrl(req.url) as { code: string };

        const {
          data: { access_token: accessToken },
        } = await axios({
          method: "post",
          url: `https://github.com/login/oauth/access_token`,
          headers: {
            accept: "application/json",
          },
          data: {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code,
          },
        });

        res.setHeader(
          "Set-Cookie",
          `${OAUTH_COOKIE_KEY}=${accessToken}; Path=/; HttpOnly;`
        );

        console.log(
          "[IN CALLBACK]",
          `${OAUTH_COOKIE_KEY} is set to set-cookie`
        );

        console.log(
          "[IN CALLBACK]",
          "req.headers.referer: ",
          req.headers.referer
        );

        const cookies = parseCookie(req.headers["cookie"]);
        console.log(
          "[IN CALLBACK]",
          "cookies['referer']: ",
          cookies?.[CALLBACK_URL]
        );

        if (cookies?.[CALLBACK_URL] != null) {
          return res
            .writeHead(302, {
              Location: cookies[CALLBACK_URL],
              [OAUTH_COOKIE_KEY]: accessToken,
            })
            .end();
        }

        res.writeHead(500);
        res.write(
          JSON.stringify({
            "req.headers.referer": req.headers.referer,
            'cookies?.["referer"]': cookies?.["referer"],
          })
        );
        return res.end();
      } catch (error) {
        res.writeHead(500);
        res.write(error.message);
        return res.end();
      }
    },

    getCallbackUrl: async (req?: IncomingMessage) => {
      const cookieString =
        typeof window !== "undefined"
          ? window.document.cookie
          : req?.headers?.["cookie"];

      if (cookieString != null) {
        const cookies = parseCookie(cookieString);

        if (cookies[CALLBACK_URL] != null) {
          return cookies[CALLBACK_URL];
        }
      }

      return null;
    },
  };
};

export const gitHubOAuth = createGitHubOAuth();
