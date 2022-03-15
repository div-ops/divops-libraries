import axios, { DivopsAxiosInstance } from "@divops/axios";

function ensureEnv(key: string): string {
  if (process.env[key] == null || process.env[key] === "") {
    throw new Error(`${key}가 제공되지 않았습니다.`);
  }
  return process.env[key];
}

interface NotionDBContextOptions {
  apiToken?: string;
  databaseId?: string;
  verbose: boolean;
}

function createNotionDBContext(
  options: NotionDBContextOptions
): DivopsAxiosInstance {
  /**
   * @description NOTION API TOKEN
   * @see https://www.notion.so/my-integrations
   */
  const apiToken = options.apiToken ?? ensureEnv("NOTION_SECRET");

  /**
   * @description NOTION DATABSE
   * @see https://developers.notion.com/docs/working-with-databases#adding-pages-to-a-database
   */
  const databaseId = options.databaseId ?? ensureEnv("NOTION_DATABASE");

  // verbose for logging of axios
  const verbose = options.verbose ?? true;

  // default headers
  const headers: Record<string, string> = {};
  headers["Authorization"] = `Bearer ${apiToken}`;
  headers["Notion-Version"] = `2021-08-16`;
  headers["Content-Type"] = `application/json`;

  // config of notion
  const config = { databaseId };

  return axios.create({
    baseURL: "https://api.notion.com",
    verboseError: verbose,
    headers,
    config,
  });
}

export { createNotionDBContext };
