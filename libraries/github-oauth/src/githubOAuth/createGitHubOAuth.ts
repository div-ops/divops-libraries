import axios from "axios";
import { createGistJSONStorage } from "@divops/gist-storage";
import { decrypt, encrypt } from "@divops/simple-crypto";
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

  const keyStoreId = GIST_STORAGE_KEY_STORE_ID;
  const userPoolKey = `gist-storage-${name}-user-pool`;
  const cryptoSecret = Buffer.from(`github-oauth-${name}`)
    .reverse()
    .slice(0, 16);

  const gistStorage = createGistJSONStorage({
    token: GIST_STORAGE_TOKEN,
    keyStoreId,
  });

  return {
    encryptGitHubID: ({ githubId }: { githubId: string }) => {
      return encrypt(githubId, { iv: cryptoSecret });
    },

    decryptGitHubID: ({ cryptedGitHubId }: { cryptedGitHubId: string }) => {
      return decrypt(cryptedGitHubId, { iv: cryptoSecret });
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
          code,
        },
      });

      const userPoolKey = `gist-storage-${name}-user-pool`;
      const githubId = (await fetchUser({ accessToken })).login;
      const cryptedGitHubId = encrypt(githubId, { iv: cryptoSecret });

      await gistStorage.set(userPoolKey, {
        ...((await gistStorage.find<any>(userPoolKey)) ?? {}),
        [cryptedGitHubId]: {
          id: cryptedGitHubId,
          githubId,
          accessToken: encrypt(accessToken, { iv: cryptoSecret }),
        },
      });

      return cryptedGitHubId;
    },

    fetchUserInfo: async ({ cryptedGitHubId }: { cryptedGitHubId: string }) => {
      const accessToken = await getAuthorization({
        key: cryptedGitHubId,
        cryptoSecret,
        gistStorage,
        userPoolKey,
      });

      return await fetchUser({ accessToken });
    },

    createResource: async <T>({
      cryptedGitHubId,
      model,
      resource,
      githubId,
    }: {
      cryptedGitHubId: string;
      model: string;
      resource: T;
      githubId: string;
    }) => {
      const resourceListKey = `gist-storage-${name}-${model}-${githubId}`;

      let [user, keyId] = await Promise.all([
        getUserFromUserPool({
          key: cryptedGitHubId,
          gistStorage,
          userPoolKey,
        }),
        gistStorage.findId(resourceListKey),
      ]);

      if (keyId == null) {
        keyId = await (async () => {
          const newId = await gistStorage.setById(null, {
            totalCount: 0,
            data: [],
          });

          await gistStorage.setById(keyStoreId, {
            ...(await gistStorage.getById(keyStoreId)),
            [resourceListKey]: newId,
          });
          return newId;
        })();
      }

      const newResource = {
        ...resource,
        githubId: user.githubId,
        created: new Date().toUTCString(),
      };

      const [prevList, newId] = await Promise.all([
        gistStorage.getById<any>(keyId),
        gistStorage.setById(null, newResource),
      ]);

      await gistStorage.setById(keyId, {
        totalCount: prevList.data.length + 1,
        data: [
          ...prevList.data,
          {
            id: newId,
            ...newResource,
          },
        ],
      });

      return newResource;
    },

    readResourceList: async ({
      model,
      githubId,
    }: {
      model: string;
      githubId: string;
    }): Promise<ResourceList> => {
      const resourceListKey = `gist-storage-${name}-${model}-${githubId}`;

      return await gistStorage.get(resourceListKey);
    },

    readResource: async <T = any>({ id }: { id: string }): Promise<T> => {
      return await gistStorage.findById(id);
    },
  };
};

interface ResourceList<T = any> {
  totalCount: number;
  data: Array<T>;
}
