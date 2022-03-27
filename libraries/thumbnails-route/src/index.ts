import { Thumb } from "@divops/thumbnails";
import { Request, Response } from "express";

export function createThumbnailsRoute({
  maxAge = 31_536_000,
  host = "127.0.0.1",
} = {}) {
  return async function handler(req: Request, res: Response) {
    const { text, theme, w, h, p } = req.query;

    if (!["localhost:3000", host].includes(req.headers.host)) {
      return res
        .status(503)
        .send(
          JSON.stringify({ message: `"${req.headers.host}" is not allowed.` })
        );
    }

    try {
      const { data, contentType } = await Thumb.generateThumbnail({
        width: w,
        height: h,
        padding: p,
        text,
        theme,
      });

      res.set("Content-Type", contentType);
      res.set("Cache-Control", `max-age=${maxAge}, public`);

      return res.status(200).end(data);
    } catch (error) {
      console.error(error.message);
      console.error(error.stack);

      res.set("thumbnails-route-error", error.message);
      return res.status(503).send(JSON.stringify({ message: error.message }));
    }
  };
}
