import { DivopsAxiosInstance } from "@divops/axios";

export async function removeBlock({
  context,
  blockId,
}: {
  context: DivopsAxiosInstance;
  blockId: string;
}) {
  return await context.delete(`/v1/blocks/${blockId}`);
}
