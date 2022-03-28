import { Application } from "express";

const withAppSetting = (app: Application) => {
  return (key: string, response: any) => {
    const data = app.get(key);

    if (["number", "string", "boolean"].some((t) => typeof data === t)) {
      return { ...response, key: data };
    }

    return { ...response, ...(app.get(key) || {}) };
  };
};

export { withAppSetting };
