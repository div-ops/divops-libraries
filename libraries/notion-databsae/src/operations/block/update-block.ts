import { DivopsAxiosInstance } from "@divops/axios";
import { Block } from "./models";

export async function updateBlock({
  context,
  block,
}: {
  context: DivopsAxiosInstance;
  block: Block;
}) {
  return await context.patch(`/v1/blocks/${block.blockId}`, {
    type: block.type,
    [block.type]: {
      text: [{ type: "text", text: { content: block.text } }],
    },
  });
}
