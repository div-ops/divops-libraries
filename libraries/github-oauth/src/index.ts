import axios from "axios";
import { IncomingMessage, ServerResponse } from "http";
import { createGistJSONStorage } from "@divops/gist-storage";
import { encrypt } from "@divops/simple-crypto";

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

function ensureVariable(key, value) {
  if (value == null || value === "") {
    throw new Error(`${key}가 주어지지 않았습니다.`);
  }
}
export const createGitHubOAuth = async ({
  name,
  callbackUrl = "referer",
  oauthCookieKey = "github-oauth",
  loginUrl = "/login/github",
  GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET,
  GIST_STORAGE_TOKEN = process.env.GIST_STORAGE_TOKEN,
  GIST_STORAGE_KEY_STORE_ID = process.env.GIST_STORAGE_KEY_STORE_ID,
}: {
  name: string;
  callbackUrl?: string;
  oauthCookieKey?: string;
  loginUrl?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  GIST_STORAGE_TOKEN?: string;
  GIST_STORAGE_KEY_STORE_ID?: string;
}) => {
  ensureVariable("GITHUB_CLIENT_ID", GITHUB_CLIENT_ID);
  ensureVariable("GITHUB_CLIENT_SECRET", GITHUB_CLIENT_SECRET);
  ensureVariable("GIST_STORAGE_TOKEN", GIST_STORAGE_TOKEN);
  ensureVariable("GIST_STORAGE_KEY_STORE_ID", GIST_STORAGE_KEY_STORE_ID);

  const cryptoSecret = Buffer.from(`github-oauth-${name}`)
    .reverse()
    .slice(0, 16);

  const gistStorage = await createGistJSONStorage({
    token: GIST_STORAGE_TOKEN,
    keyStoreId: GIST_STORAGE_KEY_STORE_ID,
  });

  return {
    /**
     * @name redirectToGitHubAuthPage
     * @example
     * const referer = req.headers.referer;
     *
     * if (req.headers.referer != null) {
     *   res.setHeader(
     *     "Set-Cookie",
     *     `${callbackUrl}=${referer}; Path=/; HttpOnly; Secure; SameSite=None;`
     *   );
     * }
     */
    redirectToGitHubAuthPage: (req: IncomingMessage, res: ServerResponse) => {
      // const referer = req.headers.referer;

      // if (req.headers.referer != null) {
      //   res.setHeader(
      //     "Set-Cookie",
      //     `${callbackUrl}=${referer}; Path=/; HttpOnly; Secure; SameSite=None;`
      //   );
      // }

      return {
        redirect: {
          destination: `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}`,
          permanent: false,
        },
      };
    },

    findGitHubToken: (req: IncomingMessage) => {
      const cookies = parseCookie(req.headers["cookie"]);

      return cookies[oauthCookieKey];
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
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
            code,
          },
        });

        res.setHeader(
          "Set-Cookie",
          `${oauthCookieKey}=${accessToken}; Path=/; HttpOnly;`
        );

        console.log("[IN CALLBACK]", `${oauthCookieKey} is set to set-cookie`);

        console.log(
          "[IN CALLBACK]",
          "req.headers.referer: ",
          req.headers.referer
        );

        const cookies = parseCookie(req.headers["cookie"]);
        console.log(
          "[IN CALLBACK]",
          "cookies['referer']: ",
          cookies?.[callbackUrl]
        );

        if (cookies?.[callbackUrl] != null) {
          return res
            .writeHead(302, {
              Location: cookies[callbackUrl],
              [oauthCookieKey]: accessToken,
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
    loginOauthAccessToken: async (code: string) => {
      const {
        data: { access_token: accessToken },
      } = await axios({
        method: "post",
        url: `https://github.com/login/oauth/access_token`,
        headers: {
          accept: "application/json",
        },
        data: {
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code: code,
        },
      });

      const userPoolKey = `gist-storage-${name}-user-pool`;
      const cryptedAccessToken = encrypt(accessToken, { iv: cryptoSecret });
      const userAccessTokenID = cryptedAccessToken.slice(0, 10);

      await gistStorage.set(userPoolKey, {
        ...((await gistStorage.find<any>(userPoolKey)) ?? {}),
        [userAccessTokenID]: cryptedAccessToken,
      });

      return userAccessTokenID;
    },
  };
};
