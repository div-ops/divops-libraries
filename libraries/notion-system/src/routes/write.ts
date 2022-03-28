import { requireAuthMiddleware } from "@divops/auth-middleware";
import * as simpleExpressRouter from "@divops/simple-express-router";
import { NotionSystemOption } from "../models";

export function createWriteRouter({ notion, cache, auth }: NotionSystemOption) {
  const router = simpleExpressRouter.createSimpleRouter(
    async ({ title, contents }) => {
      if (title == null || contents == null) {
        throw new Error(
          `title(${title}), contents(${contents})가 올바르지 않습니다.`
        );
      }

      const data = await notion.addPage(title, contents);

      cache.withRefresh([{ key: `page-list`, fn: () => notion.getPageList() }]);

      return JSON.stringify(data);
    },
    requireAuthMiddleware(auth.validator)
  );

  return router;
}
