import * as bodyParser from "body-parser";
import { Application } from "express";
import * as express from "express";
import next from "next";

export function startServer({
  customServer,
  hostname = "localhost",
  dev = process.env.NODE_ENV !== "production",
  port = 3000,
}) {
  const app = next({ dev, hostname, port });
  const handle = app.getRequestHandler() as Application;

  app.prepare().then(() => {
    const server = express();

    server.use(bodyParser.urlencoded({ extended: false }));

    server.use(bodyParser.json());

    customServer(server);

    server.all("*", handle);

    server.listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
  });
}
