import { Octokit } from "@octokit/rest";
import { DEFAULT_GIST_FILE_NAME } from "./constant";
import {
  getGistContentJSON,
  getGistContent,
  findGistIdByKey,
} from "./operations";

export async function createGistStorage({
  token,
  keyStoreId,
  baseUrl,
}: {
  token: string;
  keyStoreId: string;
  baseUrl?: string;
}) {
  const octokit = new Octokit({ auth: token, baseUrl });

  // NOTE: Ensure KeyStore
  await getGistContentJSON({ id: keyStoreId, octokit });

  const self = {
    set: async (key: string, content: string) => {
      const keyId = await findGistIdByKey(key, { id: keyStoreId, octokit });

      if (keyId != null) {
        await octokit.rest.gists.update({
          gist_id: keyId,
          files: { [DEFAULT_GIST_FILE_NAME]: { content } },
        });

        return;
      }

      const keyStoreContent = await getGistContentJSON({
        id: keyStoreId,
        octokit,
      });

      const {
        data: { id: newKeyId },
      } = await octokit.rest.gists.create({
        files: { [DEFAULT_GIST_FILE_NAME]: { content } },
        public: false,
      });

      await octokit.rest.gists.update({
        gist_id: keyStoreId,
        files: {
          [DEFAULT_GIST_FILE_NAME]: {
            content: { ...keyStoreContent, key: newKeyId },
          },
        },
      });
    },

    get: async (key: string) => {
      const id = await findGistIdByKey(key, { id: keyStoreId, octokit });

      if (id == null) {
        throw new Error(`Not Found ${key}.`);
      }

      return await getGistContent({ id, octokit });
    },

    find: async (key: string) => {
      try {
        return await self.get(key);
      } catch {
        return null;
      }
    },
  };

  return self;
}

export async function createGistJSONStorage(options: {
  token: string;
  keyStoreId: string;
  baseUrl?: string;
}) {
  const gistStorage = await createGistStorage(options);

  const self = {
    set: async <T>(key: string, content: T) => {
      await gistStorage.set(key, JSON.stringify(content));
    },

    get: async <T>(key: string) => {
      return JSON.parse(await gistStorage.get(key)) as T;
    },

    find: async <T>(key: string) => {
      try {
        return await self.get<T>(key);
      } catch {
        return null;
      }
    },
  };

  return self;
}
