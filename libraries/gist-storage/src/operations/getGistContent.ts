import { DEFAULT_GIST_FILE_NAME } from "../constant";
import { FindGistOptions } from "../types";
import { getGist } from "./getGist";

export async function getGistContent(options: FindGistOptions) {
  const gist = await getGist(options);
  const files = gist.data.files;

  if (files?.[DEFAULT_GIST_FILE_NAME] != null) {
    return files?.[DEFAULT_GIST_FILE_NAME]?.content;
  }

  const entries = Object.entries(files);

  return entries?.[0]?.[1]?.content;
}
