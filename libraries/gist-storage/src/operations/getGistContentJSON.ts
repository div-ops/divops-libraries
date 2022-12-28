import { FindGistOptions } from "../types";
import { getGistContent } from "./getGistContent";

export async function getGistContentJSON(options: FindGistOptions) {
  const content = await getGistContent(options);

  try {
    return JSON.parse(content);
  } catch {
    throw new Error(`Not Valid JSON (${options.id})`);
  }
}
