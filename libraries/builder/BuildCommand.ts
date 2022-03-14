import { Command, Option } from "clipanion";
import { build } from "esbuild";
import path from "path";
import fs from "fs";

export class BuildCommand extends Command {
  entry = Option.String("--entry", process.cwd() + "/index.ts");
  output = Option.String("--output", "index.js");

  async execute() {
    const { entry, output } = this;
    if (!fs.existsSync(entry)) {
      console.log(`[builder] entry(${entry}) 없으므로 생략합니다.`);
      return;
    }

    console.log(path.dirname(path.resolve(entry)));

    await build({
      entryPoints: [path.resolve(entry)],
      bundle: true,
      outfile: `${path.dirname(path.resolve(entry))}/build/${output}`,
    });
  }
}
