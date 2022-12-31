import { CorsOptions } from "../types";
import { createUserToken, createSetCookie } from "./login";
import { createLogout } from "./logout";
import { createUserInfo } from "./user";

export const API = {
  of({ name }: { name: string }) {
    return {
      UserToken: () => createUserToken({ name }),
      SetCookie: (options: CorsOptions) => createSetCookie(options),
      UserInfo: () => createUserInfo({ name }),
      Logout: (options: CorsOptions) => createLogout(options),
    };
  },
};
