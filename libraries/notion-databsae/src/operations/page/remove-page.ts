import { DivopsAxiosInstance } from "@divops/axios";

export async function removePage({
  context,
  pageId,
}: {
  context: DivopsAxiosInstance;
  pageId: string;
}) {
  return await context.patch(`/v1/pages/${pageId}`, { archived: true });
}
