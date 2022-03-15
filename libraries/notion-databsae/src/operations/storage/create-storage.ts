import { DivopsAxiosInstance } from "@divops/axios";
import { getTimestamp } from "../../utils/get-timestamp";

export async function createStorage(
  context: DivopsAxiosInstance
): Promise<{ storageId: string }> {
  const {
    data: { id },
  } = await context.post("/v1/pages", {
    parent: { database_id: context.config.databaseId },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: `{ "type": "storage", "timestamp":"${getTimestamp()}" }`,
            },
          },
        ],
      },
    },
  });

  await context.patch(`/v1/blocks/${id}/children`, {
    children: [
      {
        object: "block",
        type: "code",
        code: {
          text: [{ type: "json", text: { content: `{}` } }],
          language: "markdown",
        },
      },
    ],
  });

  return { storageId: id };
}
