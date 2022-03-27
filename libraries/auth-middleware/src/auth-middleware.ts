export function authMiddleware(validator: (req, res) => Promise<void>) {
  return async (req, res, next) => {
    try {
      await validator(req, res);

      req.app.set("auth", {});

      return next();
    } catch {
      req.app.set("auth", null);

      return next();
    }
  };
}
