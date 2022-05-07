import { Cli } from "clipanion";

import { ScaffoldCommand } from "./commands/ScaffoldCommand";

const [node, app, ...args] = process.argv;

const cli = new Cli({
  binaryLabel: `@divops/scaffolder`,
  binaryName: `${node} ${app}`,
  binaryVersion: `1.0.0`,
});

cli.register(ScaffoldCommand);
cli.runExit(args);
