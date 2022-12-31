import { FindGistOptions } from "../types";
import { getGistContentJSON } from "./getGistContentJSON";

const cache: Record<string, any> = {};

// 프로미스가 끝나면 캐시에 넣고, 그것과 별개로 캐시에 이미 존재한다면 그를 반환하고 없으면 기다렸다가 반환한다.
export async function findGistIdByKey(key: string, options: FindGistOptions) {
  const promised = getGistContentJSON(options).then((x) => {
    cache[options.id] = x;
    return x;
  });

  if (cache[options.id]?.[key] != null) {
    return cache[options.id][key];
  }

  return (await promised)[key];
}
