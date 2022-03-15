import { DivopsAxiosInstance } from "@divops/axios";
import {
  parseNotionBlock,
  parseNotionBlockList,
} from "../../utils/parse-notion-block";
import { reduceConcat } from "../../utils/reduce-concat";
import { Block } from "../block/models";

export async function getPage({
  context,
  pageId,
}: {
  context: DivopsAxiosInstance;
  pageId: string;
}): Promise<{
  title: Block;
  created: Block;
  contents: Block[];
  text: { title: string; created: string; contents: string };
}> {
  const {
    data: {
      results: [titleBlock, createdBlock, ...contentsBlockList],
    },
  } = await context.get(`/v1/blocks/${pageId}/children?page_size=100`);

  const title = parseNotionBlock(titleBlock, "paragraph");
  const created = parseNotionBlock(createdBlock, "paragraph");
  const contents = parseNotionBlockList(contentsBlockList);

  return {
    title,
    created,
    contents: contents,
    text: {
      title: title.text,
      created: created.text,
      contents: contents.map((x) => x.text).reduce(reduceConcat),
    },
  };
}
