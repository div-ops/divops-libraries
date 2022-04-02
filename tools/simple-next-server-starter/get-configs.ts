import fs from "fs";
import path from "path";

export function getConfigs(filepath = "divops.config.js") {
  if (!fs.existsSync(path.resolve(process.cwd(), filepath))) {
    throw new Error(`${path.resolve(process.cwd(), filepath)}가 없습니다.`);
  }

  return {
    loadConfigJs: async () => {
      const configModule = await import(path.resolve(process.cwd(), filepath));

      return configModule.default;
    },
  };
}
