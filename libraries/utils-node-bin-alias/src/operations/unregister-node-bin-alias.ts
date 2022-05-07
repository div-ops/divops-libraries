import fs from "fs";
import { getNodeBinPath } from "@divops/utils-node-bin-path";
import path from "path";

export async function unregisterNodeBinAlias(alias: string) {
  const target = path.resolve(getNodeBinPath(), alias);

  if (!fs.existsSync(target)) {
    return false;
  }

  await fs.promises.rm(target);

  return true;
}
