import { CorsOptions } from "../types";
import { createUserToken, createSetCookie } from "./login";
import { createLogout } from "./logout";
import { createUserInfo } from "./user";

export const API = {
  of({ name }: { name: string }) {
    return {
      UserToken: (options: CorsOptions) =>
        createUserToken({ name, ...options }),
      SetCookie: (options: CorsOptions) => createSetCookie(options),
      UserInfo: (options: CorsOptions) => createUserInfo({ name, ...options }),
      Logout: (options: CorsOptions) => createLogout(options),
    };
  },
};
