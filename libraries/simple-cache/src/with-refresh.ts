import { SimpleCache } from "./simple-cache";

export interface Resource {
  fn: () => Promise<any>;
  key: string;
}

export interface WithRefreshProps {
  context: SimpleCache;
  resources: Resource[];
}

export async function withRefresh({
  context,
  resources,
}: WithRefreshProps): Promise<any[]> {
  const promises = [];

  context.invalidateList(resources.map((x) => x.key));

  for (const resource of resources) {
    const cached = context.getItem(resource.key);

    if (cached != null) {
      return cached;
    }

    promises.push(
      resource.fn().then((data) => context.setItem(resource.key, data))
    );
  }

  return await Promise.all(promises);
}
