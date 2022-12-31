import axios from "axios";
import { IncomingMessage, ServerResponse } from "http";
import { createGistJSONStorage } from "@divops/gist-storage";
import { encrypt } from "@divops/simple-crypto";
import { ensureVariable, parseCookie } from "./utils";

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
      const accessTokenKey = cryptedAccessToken.slice(0, 20);

      await gistStorage.set(userPoolKey, {
        ...((await gistStorage.find<any>(userPoolKey)) ?? {}),
        [accessTokenKey]: cryptedAccessToken,
      });

      return accessTokenKey;
    },
  };
};
