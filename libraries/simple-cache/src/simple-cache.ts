import { withCache } from "./with-cache";

const defaultExpired = new Date().getTime() + 1000 * 60 * 60 * 24 * 365;

interface CacheOptions {
  expired?: number;
}

/**
 * const defaultExpired = new Date().getTime() + 1000 * 60 * 60 * 24 * 365;
 */
class SimpleCache {
  expired;
  inMemoryMap: Map<string, any>;

  constructor({ expired = defaultExpired }: CacheOptions = {}) {
    this.expired = expired;
    this.inMemoryMap = new Map();

    this.setItem = this.setItem.bind(this);
    this.getItem = this.getItem.bind(this);
    this.invalidate = this.invalidate.bind(this);
    this.withCache = this.withCache.bind(this);
  }

  setItem(key, data) {
    this.inMemoryMap.set(key, {
      expired: this.expired,
      data: data,
    });
  }

  getItem(key) {
    if (!this.inMemoryMap.has(key)) {
      return null;
    }

    const item = this.inMemoryMap.get(key);
    const now = new Date().getTime();

    if (item.expired < now) {
      this.inMemoryMap.delete(key);
      return null;
    }

    return item.data;
  }

  invalidate(key) {
    this.inMemoryMap.delete(key);
  }

  invalidateList(keyList: string[]) {
    for (const key of keyList) {
      this.inMemoryMap.delete(key);
    }
  }

  async withCache(fn, key) {
    return await withCache({ context: this, fn, key });
  }
}

export { SimpleCache, CacheOptions };

export default { SimpleCache };
