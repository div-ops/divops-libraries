import { Command, Option } from "clipanion";
import execa from "execa";
import fs from "fs";
import path from "path";

export class ScaffoldCommand extends Command {
  name = Option.String("--name", {
    required: true,
  });

  type = Option.String("--type", "libraries");

  async execute() {
    const { stdout: rootPath } = await execa("git", [
      "rev-parse",
      "--show-toplevel",
    ]);

    const scaffoldPath = `${rootPath}/${this.type}/${this.name}`;

    await fs.promises.cp(
      path.resolve(__dirname, "..", "template", "libraries"),
      scaffoldPath,
      {
        recursive: true,
      }
    );

    const packageJson = await fs.promises.readFile(
      path.resolve(scaffoldPath, "_package.json"),
      "utf8"
    );

    await fs.promises.writeFile(
      path.resolve(scaffoldPath, "_package.json"),
      packageJson.replace(/\$\{name\}/g, this.name)
    );

    await fs.promises.rename(
      path.resolve(scaffoldPath, "_package.json"),
      path.resolve(scaffoldPath, "package.json")
    );

    const { stdout } = await execa("yarn", [], {
      cwd: rootPath,
    });

    console.log(stdout);
  }
}
