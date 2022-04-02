import { getConfigs } from "./get-configs";
import { getEnvironments } from "./get-environments";
import { startServer } from "@divops/simple-next-server";

const { dev, hostname, port } = getEnvironments();

getConfigs()
  .loadConfigJs()
  .then((configModule) =>
    startServer({
      dev,
      hostname,
      port,
      customServer: configModule.customServer,
    })
  );
