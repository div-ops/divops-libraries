import { Router } from "express";
import { NotionSystemOption } from "./models";
import {
  createDetailRouter,
  createListRouter,
  createModifyRouter,
  createRemoveRouter,
  createWriteRouter,
} from "./routes";

function createNotionSystem(option: NotionSystemOption) {
  const router = Router();

  router.get("/detail", createDetailRouter(option));
  router.get("/list", createListRouter(option));
  router.post("/modify", createModifyRouter(option));
  router.post("/remove", createRemoveRouter(option));
  router.post("/write", createWriteRouter(option));

  return router;
}

export { createNotionSystem };

export type NotionSystem = ReturnType<typeof createNotionSystem>;
