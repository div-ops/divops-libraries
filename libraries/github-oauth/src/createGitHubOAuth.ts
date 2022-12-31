import axios from "axios";
import { createGistJSONStorage } from "@divops/gist-storage";
import { encrypt, decrypt } from "@divops/simple-crypto";
import { ensureVariable } from "./utils";

export const createGitHubOAuth = ({
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

  const gistStorage = createGistJSONStorage({
    token: GIST_STORAGE_TOKEN,
    keyStoreId: GIST_STORAGE_KEY_STORE_ID,
  });

  return {
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
          code,
        },
      });

      const githubID = await fetchUserGitHubID({ accessToken });
      const userPoolKey = `gist-storage-${name}-user-pool`;
      const cryptedGitHubID = encrypt(githubID, { iv: cryptoSecret });

      await gistStorage.set(userPoolKey, {
        ...((await gistStorage.find<any>(userPoolKey)) ?? {}),
        [cryptedGitHubID]: {
          id: cryptedGitHubID,
          githubID,
          accessToken: encrypt(accessToken, { iv: cryptoSecret }),
        },
      });

      return cryptedGitHubID;
    },

    fetchUserInfo: async ({ cryptedGitHubID }: { cryptedGitHubID: string }) => {
      const userPoolKey = `gist-storage-${name}-user-pool`;
      const userPool = await gistStorage.find<any>(userPoolKey);

      const { accessToken } = userPool[cryptedGitHubID] ?? {};
      const Authorization = decrypt(accessToken, { iv: cryptoSecret });

      const { data } = await axios({
        method: "get",
        url: `https://api.github.com/user`,
        headers: {
          accept: "application/vnd.github+json",
          Authorization: `Bearer ${Authorization}`,
        },
      });

      return data;
    },
  };
};

async function fetchUserGitHubID({ accessToken }: { accessToken: string }) {
  const { data } = await axios({
    method: "get",
    url: `https://api.github.com/user`,
    headers: {
      accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data.login;
}
