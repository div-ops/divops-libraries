import { DivopsAxiosInstance } from "@divops/axios";
import { getPage } from "./get-page";
import { removeBlock } from "../block/remove-block";
import { updateBlock } from "../block/update-block";
import { appendBlockList } from "../block/append-block-list";

export async function updatePage({
  context,
  pageId,
  title,
  contents,
}: {
  context: DivopsAxiosInstance;
  pageId: string;
  title: string;
  contents: string;
}) {
  const prev = await getPage({ context, pageId });

  const contentsList = contents.replace(/\n/g, "\\n").match(/.{1,1600}/g);

  await updateBlock({ context, block: { ...prev.title, text: title } });

  const promises = [];
  for (const content of prev.contents) {
    await new Promise((resolve) => setTimeout(resolve, 550));
    promises.push(removeBlock({ context, blockId: content.blockId }));
  }
  await Promise.all(promises);

  await appendBlockList({
    context,
    parentId: pageId,
    blockList: contentsList.map((text) => ({ type: "code", text })),
  });
}
