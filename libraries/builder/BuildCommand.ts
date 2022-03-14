import { Command, Option } from "clipanion";
import { pnpPlugin } from "@yarnpkg/esbuild-plugin-pnp";
import { build } from "esbuild";
import path from "path";
import fs from "fs";

export class BuildCommand extends Command {
  entry = Option.String("--entry", process.cwd() + "/index.ts");
  output = Option.String("--output", "index.js");

  async execute() {
    let { entry, output } = this;
    if (!fs.existsSync(entry)) {
      entry = entry.replace(".ts", ".js");
    }

    if (!fs.existsSync(entry)) {
      console.log(`[builder] entry(${entry}) 없으므로 생략합니다.`);
      return;
    }

    const { devDependencies } = require(`${path.dirname(
      path.resolve(entry)
    )}/package.json`);

    await build({
      bundle: true,
      target: "esnext",
      format: "cjs",
      platform: "node",
      define: {
        "process.env.NODE_ENV": '"production"',
      },
      entryPoints: [path.resolve(entry)],
      outfile: `${path.dirname(path.resolve(entry))}/build/${output}`,
      sourcemap: true,
      plugins: [pnpPlugin()],
      external: [...(devDependencies ? Object.keys(devDependencies) : [])],
    });
  }
}
