import { getBaseUrl, createAuthHeaders } from "../../../utils";

export async function fetchMemoryList({
  model,
  pageNo = 1,
}: {
  model: string;
  pageNo?: number;
}) {
  if (model == null || model === "") {
    throw new Error(`model is "${model}"`);
  }

  const response = await fetch(
    `${getBaseUrl()}/api/resource/readList?model=${model}&pageNo=${pageNo}`,
    {
      method: "GET",
      headers: {
        ...createAuthHeaders(),
      },
    }
  );

  return await response.json();
}
