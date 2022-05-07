import path from "path";

export function getNodeBinPath() {
  if (process?.env?.["_"] == null) {
    throw new Error(`process.env._ is null! (${process?.env?.["_"]})`);
  }

  return path.join(process?.env?.["_"], "..");
}
