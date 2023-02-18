export const DefaultBaseUrl = "https://app.divops.kr/github-api";

const BaseUrlOfOrigins = {
  [DefaultBaseUrl]: ["localhost", "www.creco.services"],
} as const;

type BASE_URLS = Record<
  typeof BaseUrlOfOrigins[keyof typeof BaseUrlOfOrigins][number],
  keyof typeof BaseUrlOfOrigins
>;

export const BaseUrls: BASE_URLS = Object.entries(BaseUrlOfOrigins).reduce(
  (acc, cur) => {
    return {
      ...acc,
      [cur[0]]: [...(acc[cur[0]] == null ? [] : acc[cur[0]]), ...cur[1]],
    };
  },
  {} as BASE_URLS
);
