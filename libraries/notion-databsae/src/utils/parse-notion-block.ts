import { Block } from "../operations/block/models";

export function parseNotionBlock(block, type = "code"): Block {
  if (block == null) {
    throw new Error(`[getIdAndText] block가 비어있습니다.`);
  }

  if (block.id == null) {
    throw new Error(
      `[getIdAndText] block.id가 비어있습니다.(block: ${JSON.stringify(block)})`
    );
  }

  if (
    block[type] == null ||
    block[type].text == null ||
    block[type].text[0] == null ||
    block[type].text[0].plain_text == null ||
    block[type].text[0].plain_text === ""
  ) {
    throw new Error(
      `[getIdAndText] block[type].text[0].plain_text가 올바르지 않습니다.(type: ${type}, block: ${JSON.stringify(
        block
      )})`
    );
  }

  return {
    blockId: block.id,
    type,
    text: block[type].text[0].plain_text,
  };
}

export function parseNotionBlockList(blockList, type = "code"): Block[] {
  return blockList.map((block) => parseNotionBlock(block, type));
}
