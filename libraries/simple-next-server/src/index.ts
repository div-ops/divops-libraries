import bodyParser from "body-parser";
import { Application } from "express";
import express from "express";
import next from "next";

export type NextServer = ReturnType<typeof next>;

export function startServer({
  app,
  customServer,
  hostname = "localhost",
  port = 3000,
}: {
  app: NextServer;
  customServer: (Express) => void;
  hostname?: string;
  port?: number;
}) {
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
