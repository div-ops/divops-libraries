import { Command, Option } from "clipanion";
import { pnpPlugin } from "@yarnpkg/esbuild-plugin-pnp";
import { build, OnResolveArgs, OnResolveResult } from "esbuild";
import path from "path";
import fs from "fs";

export class BuildCommand extends Command {
  entry = Option.String("--entry", process.cwd() + "/index.ts");
  output = Option.String("--output", "index.js");
  isReact = Option.Boolean("--react");

  async execute() {
    const packagePath = process.cwd();
    const {
      devDependencies,
      publishConfig,
      main,
    } = require(`${packagePath}/package.json`);

    let { entry, output } = this;
    entry = ((entry) => {
      if (entry) {
        return path.resolve(entry);
      }

      if (main) {
        return path.resolve(packagePath, main);
      }

      return path.resolve(entry);
    })(entry);

    if (!fs.existsSync(entry)) {
      entry = entry.replace(".ts", ".js");
    }

    if (!fs.existsSync(entry)) {
      console.log(`[builder] entry(${entry}) 없으므로 생략합니다.`);
      return;
    }

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
      sourcemap: false,
      ...(this.isReact
        ? {
            jsxFactory: "jsx",
            inject: [path.join(__dirname, "lib", "react-shim.js")],
          }
        : {}),
      plugins: [
        pnpPlugin(),
        {
          name: "copy",
          setup(build) {
            build.onEnd(
              () =>
                fs.existsSync("src/assets") &&
                fs.cpSync(
                  "src/assets",
                  path.join(
                    path.dirname(build.initialOptions.outfile),
                    "assets"
                  ),
                  {
                    recursive: true,
                    force: true,
                    dereference: true,
                  }
                )
            );
          },
        },
      ],
      external: [...(devDependencies ? Object.keys(devDependencies) : [])],
    });
  }
}

const pnpOnResolve: Parameters<typeof pnpPlugin>[0]["onResolve"] = async (
  args,
  { resolvedPath, error, watchFiles }
) => {
  if (resolvedPath != null) {
    if (resolvedPath.endsWith("src/internal.js")) {
      resolvedPath = resolvedPath.replace(/src\/internal.js$/, "src/index.ts");
    }
  }

  // NOTE: 아래는 pnpResolve 기본 동작
  const problems = error ? [{ text: error.message }] : [];
  // Sometimes dynamic resolve calls might be wrapped in a try / catch,
  // but ESBuild neither skips them nor does it provide a way for us to tell.
  // Because of that, we downgrade all errors to warnings in these situations.
  // Issue: https://github.com/evanw/esbuild/issues/1127
  let mergeWith;
  switch (args.kind) {
    case `require-call`:
    case `require-resolve`:
    case `dynamic-import`:
      {
        mergeWith = { warnings: problems };
      }
      break;
    default:
      {
        mergeWith = { errors: problems };
      }
      break;
  }
  if (resolvedPath !== null) {
    return { namespace: `pnp`, path: resolvedPath, watchFiles };
  } else {
    return { external: true, ...mergeWith, watchFiles };
  }
};
