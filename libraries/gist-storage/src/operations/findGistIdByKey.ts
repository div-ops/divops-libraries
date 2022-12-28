import { FindGistOptions } from "../types";
import { getGistContentJSON } from "./getGistContentJSON";

export async function findGistIdByKey(key: string, options: FindGistOptions) {
  const keyStore = await getGistContentJSON(options);
  const gistId = keyStore[key];

  return gistId;
}
