import { Octokit } from "@octokit/rest";
import { DEFAULT_GIST_FILE_NAME } from "./constant";
import {
  getGistContentJSON,
  getGistContent,
  findGistIdByKey,
} from "./operations";

export function createGistStorage({
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
  // await getGistContentJSON({ id: keyStoreId, octokit });

  const self = {
    getId: async (key: string) => {
      return await findGistIdByKey(key, { id: keyStoreId, octokit });
    },
    getById: async (id: string) => {
      return await getGistContent({ id, octokit });
    },
    get: async (key: string) => {
      const id = await self.getId(key);

      if (id == null) {
        throw new Error(`Not Found ${key}.`);
      }

      return await self.getById(id);
    },

    setById: async (id: string | null, content: string) => {
      if (id != null) {
        await octokit.rest.gists.update({
          gist_id: id,
          files: { [DEFAULT_GIST_FILE_NAME]: { content } },
        });
        return id;
      } else {
        const {
          data: { id },
        } = await octokit.rest.gists.create({
          files: { [DEFAULT_GIST_FILE_NAME]: { content } },
          public: false,
        });
        return id;
      }
    },

    set: async (key: string, content: string) => {
      const keyId = await findGistIdByKey(key, { id: keyStoreId, octokit });

      const newId = await self.setById(keyId, content);

      if (keyId == null) {
        const keyStoreContent = await getGistContentJSON({
          id: keyStoreId,
          octokit,
        });

        await octokit.rest.gists.update({
          gist_id: keyStoreId,
          files: {
            [DEFAULT_GIST_FILE_NAME]: {
              content: JSON.stringify({ ...keyStoreContent, [key]: newId }),
            },
          },
        });
      }
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

export function createGistJSONStorage(options: {
  token: string;
  keyStoreId: string;
  baseUrl?: string;
}) {
  const gistStorage = createGistStorage(options);

  const self = {
    getId: async (key: string) => {
      return await gistStorage.getId(key);
    },
    getById: async <T>(id: string) => {
      return JSON.parse(await gistStorage.getById(id)) as T;
    },
    get: async <T>(key: string) => {
      return JSON.parse(await gistStorage.get(key)) as T;
    },

    setById: async <T>(id: string | null, content: T) => {
      await gistStorage.setById(id, JSON.stringify(content));
    },
    set: async <T>(key: string, content: T) => {
      await gistStorage.set(key, JSON.stringify(content));
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
