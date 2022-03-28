import { requireAuthMiddleware } from "@divops/auth-middleware";
import * as simpleExpressRouter from "@divops/simple-express-router";
import { NotionSystemOption } from "../models";

export function createModifyRouter({
  notion,
  cache,
  auth,
}: NotionSystemOption) {
  const router = simpleExpressRouter.createSimpleRouter(
    async ({ contents, title, id }) => {
      await notion.updatePage(id, title, contents);

      cache.withRefresh([
        { key: `page-list`, fn: () => notion.getPageList() },
        { key: `detail-page-${id}`, fn: () => notion.getPage(id) },
      ]);

      return true;
    },
    requireAuthMiddleware(auth.validator)
  );

  return router;
}
