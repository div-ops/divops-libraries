import { IncomingMessage, ServerResponse } from "http";

export interface NextApiRequest extends IncomingMessage {
  body: any;
}

type Send<T> = (body: T) => void;

export type NextApiResponse<T = any> = ServerResponse & {
  json: Send<T>;
};
