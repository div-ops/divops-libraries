import { createAPIHandlerUserToken } from "./userToken";

export const API = {
  of(name: string) {
    return {
      UserToken: createAPIHandlerUserToken({ name }),
    };
  },
};
