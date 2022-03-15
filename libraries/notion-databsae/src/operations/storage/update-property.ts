import { DivopsAxiosInstance } from "@divops/axios";
import { appendBlockList } from "../block/append-block-list";
import { removeBlock } from "../block/remove-block";
import { getEntries } from "./get-entries";

export async function updateProperty({
  context,
  storageId,
  key,
  value,
}: {
  context: DivopsAxiosInstance;
  storageId: string;
  key: string;
  value: string;
}) {
  const entries = await getEntries(context, storageId);

  entries[key] = value;

  const nextContents = JSON.stringify(entries).match(/.{1,1600}/g);

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
    blockList: nextContents.map((text) => ({ type: "code", text })),
  });
}
