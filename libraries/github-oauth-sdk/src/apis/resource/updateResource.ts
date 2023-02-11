import { getBaseUrl, createAuthHeaders } from "../../utils";

export async function updateResource<R, S>({
  model,
  id,
  resource,
  summary,
}: {
  model: string;
  id: string;
  resource: R;
  summary: S;
}) {
  if (model == null || model === "") {
    throw new Error(`model is "${model}"`);
  }
  if (id == null || id === "") {
    throw new Error(`id is "${id}"`);
  }

  await fetch(`${getBaseUrl()}/api/resource/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...createAuthHeaders(),
    },
    body: JSON.stringify({
      id,
      model,
      resource,
      summary,
    }),
  });
}
