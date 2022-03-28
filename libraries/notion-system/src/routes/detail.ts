import * as simpleExpressRouter from "@divops/simple-express-router";
import { NotionSystemOption } from "../models";

export function createDetailRouter({ notion, cache }: NotionSystemOption) {
  const router = simpleExpressRouter.createSimpleRouter(async ({ id, req }) => {
    const details = await cache.withCache(
      () => notion.getPage(id),
      `detail-page-${id}`
    );

    return simpleExpressRouter.withAppSetting(req.app)("auth", {
      ...details.text,
    });
  });

  return router;
}
