import { requireAuthMiddleware } from "@divops/auth-middleware";
import * as simpleExpressRouter from "@divops/simple-express-router";
import { NotionSystemOption } from "../models";

export function createRemoveRouter({
  notion,
  cache,
  auth,
}: NotionSystemOption) {
  const router = simpleExpressRouter.createSimpleRouter(async ({ id }) => {
    const data = await notion.removePage(id);

    cache.withRefresh([
      { key: `page-list`, fn: () => notion.getPageList() },
      { key: `detail-page-${id}` },
    ]);

    return JSON.stringify(data);
  }, requireAuthMiddleware(auth.validator));

  return router;
}
