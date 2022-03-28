import * as simpleExpressRouter from "@divops/simple-express-router";
import { NotionSystemOption } from "../models";

export function createListRouter({ notion, cache }: NotionSystemOption) {
  const router = simpleExpressRouter.createSimpleRouter(async ({ req }) => {
    const list = await cache.withCache(() => notion.getPageList(), `page-list`);

    return simpleExpressRouter.withAppSetting(req.app)("auth", {
      list,
    });
  });

  return router;
}
