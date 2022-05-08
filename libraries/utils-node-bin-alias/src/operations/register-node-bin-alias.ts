import fs from "fs";
import path from "path";
import { getNodeBinPath } from "@divops/utils-node-bin-path";

// e.g. alias: todo or wiki or ...
// e.g. targetBinary: /Users/$USER/.config/yarn/global/node_modules/\@divops/[appName]/dist/index.js
export async function registerNodeBinAlias(
  alias: string,
  targetBinary: string
) {
  const aliasPath = path.resolve(getNodeBinPath(), alias);

  if (fs.existsSync(aliasPath)) {
    throw new Error(`already exists ${JSON.stringify({ aliasPath })}.`);
  }

  if (!fs.existsSync(path.resolve(targetBinary))) {
    throw new Error(`not exists ${JSON.stringify({ targetBinary })}.`);
  }

  // FIXME: sh 파라미터를 사용하는 만큼 받을 수 있도록 처리 필요
  const args = new Array(100)
    .fill(0)
    .map((_, i) => `$\{${i + 1}\}`)
    .join(" ")
    .trim();

  await fs.promises.writeFile(aliasPath, `node ${targetBinary} ${args}`);

  console.log(`${alias} is added \`node ${targetBinary} ...args\``);

  await fs.promises.chmod(aliasPath, 0o755);

  return true;
}
