import { Request, Response, Router } from "express";

type Resource = (...args) => Promise<any>;

const createSimpleRouter = (resource: Resource, requiredMiddleware?: any) => {
  const router = Router();

  // FIXME: any type
  if (requiredMiddleware != null) {
    router.use(requiredMiddleware);
  }

  router.use(async (req: Request, res: Response) => {
    const args = { ...req.query, ...req.body, ...req.params };

    try {
      return res.send(await resource({ ...args, req, res }));
    } catch (error) {
      console.error(error.message);
      console.error(error.stack);
      res.set("error-message", error.message);
      return res.status(500).json({ message: error.message });
    }
  });

  return router;
};

export { createSimpleRouter };
