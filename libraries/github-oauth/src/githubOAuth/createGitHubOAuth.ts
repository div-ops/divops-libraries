import axios from "axios";
import { createGistJSONStorage } from "@divops/gist-storage";
import { encrypt } from "@divops/simple-crypto";
import { getAuthorization, getUserFromUserPool } from "./utils";
import { ensureVariable } from "../utils";
import { fetchUser } from "./resource";

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

  const userPoolKey = `gist-storage-${name}-user-pool`;
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

      const userPoolKey = `gist-storage-${name}-user-pool`;
      const githubId = (await fetchUser({ accessToken })).login;
      const cryptedGitHubID = encrypt(githubId, { iv: cryptoSecret });

      await gistStorage.set(userPoolKey, {
        ...((await gistStorage.find<any>(userPoolKey)) ?? {}),
        [cryptedGitHubID]: {
          id: cryptedGitHubID,
          githubId,
          accessToken: encrypt(accessToken, { iv: cryptoSecret }),
        },
      });

      return cryptedGitHubID;
    },

    fetchUserInfo: async ({ cryptedGitHubID }: { cryptedGitHubID: string }) => {
      const accessToken = await getAuthorization({
        key: cryptedGitHubID,
        cryptoSecret,
        gistStorage,
        userPoolKey,
      });

      return await fetchUser({ accessToken });
    },

    createResource: async <T>({
      cryptedGitHubID,
      model,
      resource,
    }: {
      cryptedGitHubID: string;
      model: string;
      resource: T;
    }) => {
      const resourceListKey = `gist-storage-${name}-${model}-list`;

      const [user, keyId] = await Promise.all([
        getUserFromUserPool({
          key: cryptedGitHubID,
          gistStorage,
          userPoolKey,
        }),
        gistStorage.getId(resourceListKey),
      ]);

      console.log(`1STEP`, { user, keyId });

      const [prevList, newId] = await Promise.all([
        gistStorage.getById<any>(keyId),
        gistStorage.setById(null, resource),
      ]);

      console.log(`2STEP`, { prevList, newId });

      const newResource = {
        id: newId,
        githubId: user.githubId,
        created: new Date().toUTCString(),
      };

      console.log(`3STEP`, { newResource });

      await gistStorage.setById(keyId, {
        count: prevList.data.length + 1,
        data: [...prevList.data, newResource],
      });

      console.log(`4STEP`, { newResource });

      return newResource;
    },
  };
};
