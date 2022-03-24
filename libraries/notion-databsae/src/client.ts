import { NotionDBContextOptions, createNotionDBContext } from "./context";
import * as operations from "./operations";

export type NotionDBClient = ReturnType<typeof createNotionDBClient>;

export function createNotionDBClient(options: NotionDBContextOptions) {
  const context = createNotionDBContext(options);

  return {
    async addPage(title: string, contents: string) {
      return await operations.addPage({ context, title, contents });
    },

    async getPage(pageId: string) {
      return await operations.getPage({ context, pageId });
    },

    async getPageList() {
      return await operations.getPageList({ context });
    },

    async updatePage(pageId: string, title: string, contents: string) {
      return await operations.updatePage({
        context,
        pageId,
        title,
        contents,
      });
    },

    async removePage(pageId: string) {
      return await operations.removePage({ context, pageId });
    },
  };
}
