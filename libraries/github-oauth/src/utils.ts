import { NextApiRequest } from "./types";

export function getQueryFromUrl(url: string) {
  if (!url.includes("?")) {
    return {};
  }

  const querystring = url.slice(url.indexOf("?") + 1);
  return querystring.split("&").reduce((acc, cur) => {
    const [key, value] = cur.split("=");
    if (key != null && value != null) {
      return {
        ...acc,
        [key]: value,
      };
    }

    return acc;
  }, {});
}

export function ensureVariable(key, value) {
  if (value == null || value === "") {
    throw new Error(`${key}가 주어지지 않았습니다.`);
  }
}
