import { FindGistOptions } from "../types";

export async function getGist({ id, octokit }: FindGistOptions) {
  try {
    return await octokit.rest.gists.get({ gist_id: id });
  } catch {
    throw new Error(`Not Exists Gist (${id})`);
  }
}
