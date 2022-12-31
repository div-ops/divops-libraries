import {
  createUserToken,
  createCallback,
  SetCookieOptions,
  createSetCookie,
} from "./login";
import { createUserInfo } from "./user";

export const API = {
  of({ name }: { name: string }) {
    return {
      UserToken: () => createUserToken({ name }),
      Callback: () => createCallback({ name }),
      SetCookie: (options: SetCookieOptions) => createSetCookie(options),
      UserInfo: () => createUserInfo({ name }),
    };
  },
};
