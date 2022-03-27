export function authMiddleware(key, validator: (req, res) => Promise<void>) {
  return async (req, res, next) => {
    try {
      const auth = await validator(req, res);

      req.app.set(key, auth == null ? {} : auth);

      return next();
    } catch {
      req.app.set(key, null);

      return next();
    }
  };
}

export function requireAuthMiddleware(validator: (req, res) => Promise<void>) {
  return async (req, res, next) => {
    try {
      await validator(req, res);
      return next();
    } catch {
      return res.status(403).send("403 Forbidden");
    }
  };
}
