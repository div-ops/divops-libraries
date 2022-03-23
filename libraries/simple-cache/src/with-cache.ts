import { SimpleCache } from "./simple-cache";

interface WithCacheProps {
  context: SimpleCache;
  fn: () => Promise<any>;
  key: string;
}

export async function withCache({
  context,
  fn,
  key,
}: WithCacheProps): Promise<any> {
  const cached = context.getItem(key);

  if (cached != null) {
    console.log(`Cache is hited ${key}`);
    return cached;
  }

  const data = await fn();

  context.setItem(key, data);

  return data;
}
