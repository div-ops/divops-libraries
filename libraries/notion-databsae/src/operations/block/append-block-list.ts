import { DivopsAxiosInstance } from "@divops/axios";
import { Block } from "./models";

export async function appendBlockList({
  context,
  parentId,
  blockList,
}: {
  context: DivopsAxiosInstance;
  parentId: string;
  blockList: Block[];
}) {
  return await context.patch(`/v1/blocks/${parentId}/children`, {
    children: blockList.map(({ type, text }) => ({
      object: "block",
      type,
      [type]: {
        text: [{ type: "text", text: { content: text } }],
        ...(type === "code" ? { language: "json" } : {}),
      },
    })),
  });
}
