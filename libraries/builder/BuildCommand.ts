import { Command, Option } from "clipanion";
import { build } from "esbuild";
import path from "path";

export class BuildCommand extends Command {
  entry = Option.String("--entry", process.cwd() + "/index.ts");
  output = Option.String("--output", "index.js");

  async execute() {
    const { entry, output } = this;
    console.log(path.dirname(path.resolve(entry)));

    await build({
      entryPoints: [path.resolve(entry)],
      bundle: true,
      outfile: `${path.dirname(path.resolve(entry))}/build/${output}`,
    });
  }
}
