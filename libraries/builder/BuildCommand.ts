import { Command, Option } from "clipanion";
import { pnpPlugin } from "@yarnpkg/esbuild-plugin-pnp";
import { build } from "esbuild";
import path from "path";
import fs from "fs";

export class BuildCommand extends Command {
  entry = Option.String("--entry", process.cwd() + "/index.ts");
  output = Option.String("--output", "index.js");

  async execute() {
    const packagePath = process.cwd();

    let { entry, output } = this;
    if (!fs.existsSync(entry)) {
      entry = entry.replace(".ts", ".js");
    }

    if (!fs.existsSync(entry)) {
      console.log(`[builder] entry(${entry}) 없으므로 생략합니다.`);
      return;
    }

    const { devDependencies, publishConfig } = require(`${path.dirname(
      path.resolve(entry)
    )}/package.json`);

    const outfile = ((output) => {
      if (publishConfig && publishConfig.main) {
        return path.resolve(packagePath, publishConfig.main);
      }

      return `${path.dirname(path.resolve(entry))}/build/${output}`;
    })(output);

    await build({
      bundle: true,
      target: "esnext",
      format: "cjs",
      platform: "node",
      define: {
        "process.env.NODE_ENV": '"production"',
      },
      entryPoints: [path.resolve(entry)],
      outfile,
      sourcemap: true,
      plugins: [pnpPlugin()],
      external: [...(devDependencies ? Object.keys(devDependencies) : [])],
    });
  }
}
