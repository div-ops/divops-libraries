import { SimpleCache } from "@divops/simple-cache";
import { SimpleAuth } from "@divops/simple-auth";
import { NotionDBClient } from "@divops/notion-database";

export interface NotionSystemOption {
  notion: NotionDBClient;
  cache: SimpleCache;
  auth: SimpleAuth;
}
