import { DivopsAxiosInstance } from "@divops/axios";
import { appendBlockList } from "./append-block-list";
import { Block } from "./models";

export async function appendBlock({
  context,
  parentId,
  block,
}: {
  context: DivopsAxiosInstance;
  parentId: string;
  block: Block;
}) {
  return await appendBlockList({ context, parentId, blockList: [block] });
}
