import { DivopsAxiosInstance } from "@divops/axios";
import { chunkStr } from "../../utils/chunk-str";
import { appendBlockList } from "../block/append-block-list";
import { removeBlock } from "../block/remove-block";
import { getEntries } from "./get-entries";

export async function removeProperty({
  context,
  storageId,
  key,
}: {
  context: DivopsAxiosInstance;
  storageId: string;
  key: string;
}) {
  const entries = await getEntries(context, storageId);

  delete entries[key];

  const {
    data: { results: previousBlocks },
  } = await context.get(`/v1/blocks/${storageId}/children?page_size=100`);

  const promises = [];
  for (const block of previousBlocks) {
    if (block.id != null) {
      await new Promise((resolve) => setTimeout(resolve, 550));
      promises.push(removeBlock(block.id));
    }
  }
  await Promise.all(promises);

  await appendBlockList({
    context,
    parentId: storageId,
    blockList: chunkStr(JSON.stringify(entries), 1600).map((text) => ({
      type: "code",
      text,
    })),
  });
}
