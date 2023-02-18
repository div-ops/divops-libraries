const BaseUrlOfOrigins = {
  "https://app.divops.kr/github-api": ["localhost", "www.creco.services"],
} as const;

export const DefaultBaseUrl = "https://app.divops.kr/github-api";

type BaseUrlsType = {
  [key in typeof BaseUrlOfOrigins[typeof DefaultBaseUrl][number]]: typeof DefaultBaseUrl;
};

export const BaseUrls: BaseUrlsType = Object.entries(BaseUrlOfOrigins).reduce(
  (acc, [key, values]) => {
    values.forEach((value) => {
      acc[value as keyof BaseUrlsType] = key as typeof DefaultBaseUrl;
    });
    return acc;
  },
  {} as BaseUrlsType
);
