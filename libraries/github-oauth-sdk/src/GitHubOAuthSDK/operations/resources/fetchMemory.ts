import { getBaseUrl, createAuthHeaders } from "../../../utils";

export async function fetchMemory({
  model,
  id,
}: {
  model: string;
  id: string;
}) {
  if (model == null || model === "") {
    throw new Error(`model is "${model}"`);
  }
  if (id == null || id === "") {
    throw new Error(`id is "${id}"`);
  }

  const response = await fetch(
    `${getBaseUrl()}/api/resource/read?model=${model}&id=${id}`,
    {
      method: "GET",
      headers: {
        ...createAuthHeaders(),
      },
    }
  );

  return await response.json();
}
