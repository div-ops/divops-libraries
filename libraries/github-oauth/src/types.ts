import { IncomingMessage, ServerResponse } from "http";

export interface NextApiRequest extends IncomingMessage {
  query: Partial<{
    [key: string]: string | string[];
  }>;
  cookies: Partial<{
    [key: string]: string;
  }>;
  body: any;
}

type Send<T> = (body: T) => void;

export type NextApiResponse<T = any> = ServerResponse & {
  json: Send<T>;
  status: (statusCode: number) => NextApiResponse<T>;
};

export interface CorsOptions {
  before: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
}
