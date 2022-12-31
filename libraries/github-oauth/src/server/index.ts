import { createAPIHandlerUserToken } from "./userToken";

export const API = {
  of({ name }: { name: string }) {
    return {
      UserToken: createAPIHandlerUserToken({ name }),
    };
  },
};
