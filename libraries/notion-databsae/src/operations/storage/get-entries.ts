import { DivopsAxiosInstance } from "@divops/axios";
import { parseNotionBlock } from "../../utils/parse-notion-block";
import { reduceConcat } from "../../utils/reduce-concat";

export async function getEntries(
  context: DivopsAxiosInstance,
  storageId: string
) {
  const {
    data: { results },
  } = await context.get(`/v1/blocks/${storageId}/children?page_size=100`);

  if (results == null) {
    throw new Error(`[getEntries] results가 비어있습니다.`);
  }

  const result = results.map(parseNotionBlock).reduce(reduceConcat);

  try {
    return JSON.parse(result);
  } catch (error) {
    throw new Error(
      [
        `[getEntries] result가 JSON 형식이 아닙니다.`,
        JSON.stringify(result, null, 2),
      ].join("\n")
    );
  }
}
