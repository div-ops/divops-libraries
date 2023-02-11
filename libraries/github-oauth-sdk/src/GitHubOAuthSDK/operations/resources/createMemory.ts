import { getBaseUrl, createAuthHeaders } from "../../../utils";

export async function createMemory<R, S>({
  model,
  resource,
  summary,
}: {
  model: string;
  resource: R;
  summary: S;
}) {
  if (model == null || model === "") {
    throw new Error(`model is "${model}"`);
  }

  await fetch(`${getBaseUrl()}/api/resource/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...createAuthHeaders(),
    },
    body: JSON.stringify({
      model,
      resource,
      summary,
    }),
  });
}
