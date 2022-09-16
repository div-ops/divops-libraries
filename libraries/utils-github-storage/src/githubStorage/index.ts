import { Octokit } from "@octokit/rest";

// NOTE
// - Storage: 레포 그 자체
// - Object: 레포 내의 파일
// - create(key, content): Object를 생성한다.
// - update(key, content): Object를 수정한다.
// - exists(key): Object 혹은 Directory가 있는지 검사한다.
// - get(key): Object를 가져온다.
// - getList(key): 디렉토리의 Object 이름 리스트를 가져온다.
// - delete(key): Object를 지운다.
//   - (key.deleted.[the number of milliseconds since the ECMAScript epoch] 로 파일 이름을 업데이트한다.)

interface GeneralStorage {
  exists: (key: string) => Promise<boolean>;
  get: (key: string) => Promise<string>;
  getList: (key: string) => Promise<string[]>;
  create: (key: string, content: string) => Promise<void>;
  update: (key: string, content: string) => Promise<void>;
  remove: (key: string) => Promise<void>;
}

interface Repository {
  owner: string;
  repo: string;
}

interface OctokitOptions {
  auth: string;
  baseUrl: string;
}

interface GithubStorageContext extends Repository, OctokitOptions {}

function createGithubStorage(context: GithubStorageContext): GeneralStorage {
  const { auth, baseUrl, repo, owner } = context;

  const octokit = new Octokit({ auth, baseUrl });

  const gs = {
    exists: async (key: string) => {
      try {
        await octokit.rest.repos.getContent({
          owner,
          repo,
          path: key,
        });

        return true;
      } catch (error) {
        if (error.status === 404) {
          return false;
        }
        throw error;
      }
    },
    get: async (key: string) => {
      const { data } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: key,
      });

      if (Array.isArray(data) || !("content" in data)) {
        throw new Error(`Error: ${key} is not object.`);
      }

      return Buffer.from(data.content, "base64").toString("utf8");
    },

    getList: async (key: string) => {
      const { data } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: key,
      });

      if (!Array.isArray(data)) {
        throw new Error(`Error: ${key} is not directory.`);
      }

      return data.map((x) => x.name);
    },

    create: async (key: string, content: string) => {
      if (await gs.exists(key)) {
        throw new Error(`Error: ${key} already exists.`);
      }

      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: key,
        message: `GS created "${key}" object.`,
        content: Buffer.from(content).toString("base64"),
      });
    },

    update: async (key: string, content: string) => {
      if (!(await gs.exists(key))) {
        throw new Error(`Error: ${key} not exists.`);
      }

      const { data } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: key,
      });

      if (Array.isArray(data) || !("content" in data)) {
        throw new Error(`Error: ${key} is not object`);
      }

      const { sha } = data;

      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: key,
        sha: sha,
        message: `GS updated "${key}" object.`,
        content: Buffer.from(content).toString("base64"),
      });
    },

    remove: async (key: string) => {
      if (!(await gs.exists(key))) {
        throw new Error(`Error: ${key} not exists.`);
      }

      const { data } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: key,
      });

      if (Array.isArray(data) || !("content" in data)) {
        throw new Error(`Error: ${key} is not object`);
      }

      const { sha, content } = data;

      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: `${key}.deleted.${Date.now()}`,
        message: `GS rename "${key}" object. [copy stage]`,
        content,
      });

      await octokit.rest.repos.deleteFile({
        owner,
        repo,
        path: key,
        message: `GS rename "${key}" object. [delete stage]`,
        sha,
      });
    },
  };

  return gs;
}

/**
 * @name githubStorageClient
 *
 * @description
 * github 스토리지를 생성할 수 있는 client 객체다.
 *
 * @example
 * import { githubStorageClient } from "@divops/utils-github-storage"
 *
 * const githubContext = { auth, baseUrl };
 * const repository = { owner, repo };
 * const gs = githubStorageClient.of(githubContext).storage(repository);
 */
export const githubStorageClient = {
  of: (options: OctokitOptions) => ({
    storage: (repository: Repository) =>
      createGithubStorage({ ...options, ...repository }),
  }),
};
