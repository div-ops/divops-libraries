import { createCallback } from "./callback";
import { createSetCookie, SetCookieOptions } from "./setCookie";
import { createUserToken } from "./userToken";

export const API = {
  of({ name }: { name: string }) {
    return {
      UserToken: () => createUserToken({ name }),
      Callback: () => createCallback({ name }),
      SetCookie: (options: SetCookieOptions) => createSetCookie(options),
    };
  },
};
