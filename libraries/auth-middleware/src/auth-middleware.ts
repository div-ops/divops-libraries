export function authMiddleware(key, validator: (req, res) => Promise<void>) {
  return async (req, res, next) => {
    try {
      await validator(req, res);

      req.app.set(key, {});

      return next();
    } catch {
      req.app.set(key, null);

      return next();
    }
  };
}
