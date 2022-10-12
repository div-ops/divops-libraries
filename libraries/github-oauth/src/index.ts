import axios from "axios";
import { IncomingMessage, ServerResponse } from "http";

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
  REFERER_COOKIE_KEY = "referer",
  OAUTH_COOKIE_KEY = "github-oauth",
}: {
  CLIENT_ID?: string;
  CLIENT_SECRET?: string;
  REFERER_COOKIE_KEY?: string;
  OAUTH_COOKIE_KEY?: string;
} = {}) => {
  return {
    redirectToGitHubAuthPage: (req: IncomingMessage, res: ServerResponse) => {
      const referer = req.headers.referer;

      if (req.headers.referer != null) {
        res.setHeader(
          "Set-Cookie",
          `${REFERER_COOKIE_KEY}=${referer}; Path=/; HttpOnly; Secure; SameSite=None;`
        );
      }

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

      // if (req.headers.referer != null) {
      //   return res.writeHead(302, { Location: req.headers.referer }).end();
      // }

      const cookies = parseCookie(req.headers["cookie"]);
      if (cookies[REFERER_COOKIE_KEY] != null) {
        return res
          .writeHead(302, { Location: cookies[REFERER_COOKIE_KEY] })
          .end();
      }

      return res.writeHead(302, { Location: "/" }).end();
    },
  };
};

export const gitHubOAuth = createGitHubOAuth();
