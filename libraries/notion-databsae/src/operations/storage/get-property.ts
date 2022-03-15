import { DivopsAxiosInstance } from "@divops/axios";
import { getEntries } from "./get-entries";

export async function getProperty(
  context: DivopsAxiosInstance,
  storageId: string,
  key: string
): Promise<string> {
  const entries = await getEntries(context, storageId);

  if (!(key in entries)) {
    throw new Error(
      [`entries에 ${key}가 없습니다.`, JSON.stringify(entries, null, 2)].join(
        "\n"
      )
    );
  }

  return entries[key];
}
