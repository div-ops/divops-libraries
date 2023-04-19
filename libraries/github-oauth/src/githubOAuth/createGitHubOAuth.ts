import axios from "axios";
import { createGistJSONStorage } from "@divops/gist-storage";
import { decrypt, encrypt } from "@divops/simple-crypto";
import { getAuthorization, getUserFromUserPool } from "./utils";
import { ensureVariable } from "../utils";
import { fetchUser } from "./resource";

export const createGitHubOAuth = ({
  server,
  client,
  callbackUrl = "referer",
  oauthCookieKey = "github-oauth",
  loginUrl = "/login/github",
  GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET,
  GIST_STORAGE_TOKEN = process.env.GIST_STORAGE_TOKEN,
  GIST_STORAGE_KEY_STORE_ID = process.env.GIST_STORAGE_KEY_STORE_ID,
}: {
  server: string;
  client: string;
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
  const userPoolKey = `gist-storage-${server}-${client}-user-pool`;
  const cryptoSecret = Buffer.from(`github-oauth-${server}-${client}`)
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

      const userPoolKey = `gist-storage-${server}-${client}-user-pool`;
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

    createResource: async <S, R>({
      cryptedGitHubId,
      model,
      summary,
      resource,
      githubId,
    }: {
      cryptedGitHubId: string;
      model: string;
      summary: S;
      resource: R;
      githubId: string;
    }) => {
      const start = Date.now();
      const resourceListKey = `gist-storage-${server}-${client}-${model}-${githubId}`;
      console.log(`[go.createResource] 1 STEP: ${start - Date.now()}ms`);

      let [user, keyId] = await Promise.all([
        getUserFromUserPool({
          key: cryptedGitHubId,
          gistStorage,
          userPoolKey,
        }),
        gistStorage.findId(resourceListKey),
      ]);
      console.log(`[go.createResource] 2 STEP: ${start - Date.now()}ms`);

      if (keyId == null) {
        console.log(`[go.createResource] 3 STEP: ${start - Date.now()}ms`);
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
      } else {
        console.log(`[go.createResource] 3 STEP: ${start - Date.now()}ms`);
      }

      const created = new Date().toUTCString();
      console.log(`[go.createResource] 4 STEP: ${start - Date.now()}ms`);

      const [prevList, newId] = await Promise.all([
        gistStorage.getById<any>(keyId),
        gistStorage.setById(null, { summary, githubId, created, ...resource }),
      ]);

      console.log(`[go.createResource] 5 STEP: ${start - Date.now()}ms`);

      await gistStorage.setById(keyId, {
        totalCount: prevList.data.length + 1,
        data: [...prevList.data, { id: newId, ...summary, githubId, created }],
      });
      console.log(`[go.createResource] 6 STEP: ${start - Date.now()}ms`);
    },

    readResourceList: async ({
      model,
      githubId,
    }: {
      model: string;
      githubId: string;
    }): Promise<ResourceList> => {
      const resourceListKey = `gist-storage-${server}-${client}-${model}-${githubId}`;

      return await gistStorage.get(resourceListKey);
    },

    readResource: async <T = any>({ id }: { id: string }): Promise<T> => {
      return await gistStorage.findById(id);
    },

    deleteResource: async ({
      model,
      id,
      githubId,
    }: {
      model: string;
      id: string;
      githubId: string;
    }) => {
      const resourceListKey = `gist-storage-${server}-${client}-${model}-${githubId}`;

      const keyId = await gistStorage.getId(resourceListKey);

      const removedList = await gistStorage
        .getById<any>(keyId)
        .then((x) => x.data.filter((xx) => xx.id !== id));

      await gistStorage.setById(keyId, {
        totalCount: removedList.length,
        data: [...removedList],
      });

      await gistStorage.removeById(id);
    },

    updateResource: async <S, R>({
      id,
      cryptedGitHubId,
      model,
      summary,
      resource,
      githubId,
    }: {
      id: string;
      cryptedGitHubId: string;
      model: string;
      summary: S;
      resource: R;
      githubId: string;
    }) => {
      const start = Date.now();
      console.log(`[go.ureateResource] 1 STEP: ${start - Date.now()}ms`);
      const resourceListKey = `gist-storage-${server}-${client}-${model}-${githubId}`;

      const keyId = await gistStorage.getId(resourceListKey);
      console.log(`[go.ureateResource] 2 STEP: ${start - Date.now()}ms`);

      const prevList = await gistStorage.getById<any>(keyId);
      console.log(`[go.ureateResource] 3 STEP: ${start - Date.now()}ms`);

      const prevIndex = prevList.data.findIndex((x) => x.id === id);
      const prevItem = prevList.data[prevIndex];
      const updatedItem = { ...prevItem, ...resource, summary };
      console.log(`[go.ureateResource] 4 STEP: ${start - Date.now()}ms`);

      await gistStorage.setById(id, updatedItem);
      console.log(`[go.ureateResource] 5 STEP: ${start - Date.now()}ms`);

      prevList.data[prevIndex] = updatedItem;

      await gistStorage.setById(keyId, {
        totalCount: prevList.length,
        data: [...prevList.data],
      });
      console.log(`[go.ureateResource] 6 STEP: ${start - Date.now()}ms`);
    },
  };
};

interface ResourceList<T = any> {
  totalCount: number;
  data: Array<T>;
}
