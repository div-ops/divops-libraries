import { getBaseUrl, createAuthHeaders } from "../../utils";

export async function deleteResource({
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

  await fetch(`${getBaseUrl()}/api/resource/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...createAuthHeaders(),
    },
    body: JSON.stringify({
      model,
      id: id,
    }),
  });
}
