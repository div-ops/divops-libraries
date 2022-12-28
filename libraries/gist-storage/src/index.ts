import { Octokit } from "@octokit/rest";
import { DEFAULT_GIST_FILE_NAME, DEFAULT_GITHUB_BASE_URL } from "./constant";
import {
  getGistContentJSON,
  getGistContent,
  findGistIdByKey,
} from "./operations";

export async function createGistStorage({
  token,
  keyStoreId,
  baseUrl = DEFAULT_GITHUB_BASE_URL,
}: {
  token: string;
  keyStoreId: string;
  baseUrl: string;
}) {
  const octokit = new Octokit({ auth: token, baseUrl });

  // NOTE: Ensure KeyStore
  await getGistContentJSON({ id: keyStoreId, octokit });

  return {
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
  };
}
