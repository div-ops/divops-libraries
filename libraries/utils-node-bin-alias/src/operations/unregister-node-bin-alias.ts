import fs from "fs";
import path from "path";
import { getNodeBinPath } from "@divops/utils-node-bin-path";

export async function unregisterNodeBinAlias(alias: string) {
  const target = path.resolve(getNodeBinPath(), alias);

  if (!fs.existsSync(target)) {
    return false;
  }

  await fs.promises.rm(target);

  return true;
}
