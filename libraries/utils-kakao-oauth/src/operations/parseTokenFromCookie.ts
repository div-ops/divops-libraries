import { KakaoToken } from "../models";

export function parseTokenFromCookie(cookie: string): KakaoToken {
  const { accessToken, refreshToken } = parseCookie(cookie);

  return { accessToken, refreshToken };
}

function parseCookie(cookie: string): Record<string, string> {
  const cookies = cookie.split(";").map((x) => x.trim());

  return cookies.reduce((acc, cur) => {
    const [key, value] = cur.split("=");

    if (key == null || value == null) {
      return acc;
    }

    return {
      ...acc,
      [key]: value,
    };
  }, {});
}
