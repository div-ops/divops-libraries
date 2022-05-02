import { Command, Option, Cli } from "clipanion";
import { command } from "./command";

class DefaultCommand extends Command {
  token = Option.String(`--token`, {
    required: true,
  });

  ref = Option.String(`--ref`, {
    required: false,
  });

  url = Option.String({
    required: true,
  });

  async execute() {
    try {
      const { url, token, ref } = this;
      await command({ url, token, ref });
    } catch (e) {
      console.log("\x1b[31m%s\x1b[0m", "Error:", e.message); //cyan
      process.exit(1);
    }
  }
}

const cli = new Cli({
  binaryLabel: "github-content-sha",
  binaryName: "github-content-sha",
  binaryVersion: "0.0.1",
});

cli.register(DefaultCommand);

cli.runExit(process.argv.slice(2));
