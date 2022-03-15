import { DivopsAxiosInstance } from "@divops/axios";
import { getLocalDate } from "../../utils/get-local-date";
import { getTimestamp } from "../../utils/get-timestamp";

export async function createPage({
  context,
  title,
  contents = "",
}: {
  context: DivopsAxiosInstance;
  title: string;
  contents?: string;
}): Promise<{ pageId: string }> {
  const created = getLocalDate();
  const content = {
    timestamp: getTimestamp(),
    title: title,
    created: created,
    summary: contents.trim().split("\n")[0],
  };

  const {
    data: { id: pageId },
  } = await context.post(`/v1/pages`, {
    parent: { database_id: context.config.databaseId },
    properties: {
      Name: { title: [{ text: { content: JSON.stringify(content) } }] },
    },
  });

  const contentsList = contents.replace(/\n/g, "\\n").match(/.{1,1600}/g);
  await context.patch(`/v1/blocks/${pageId}/children`, {
    children: [
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          text: [{ type: "text", text: { content: title } }],
        },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          text: [{ type: "text", text: { content: created } }],
        },
      },
      ...contentsList.map((contents) => ({
        object: "block",
        type: "code",
        code: {
          text: [{ type: "text", text: { content: contents } }],
          language: "markdown",
        },
      })),
    ],
  });

  return { pageId };
}
