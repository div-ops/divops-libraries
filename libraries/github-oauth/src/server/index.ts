import { CorsOptions } from "../types";
import {
  createCreateResource,
  createReadResource,
  createReadResourceList,
  createDeleteResource,
} from "./crud";
import { createUserToken, createSetCookie } from "./login";
import { createLogout } from "./logout";
import { createUserInfo } from "./user";

export const API = {
  of({ name }: { name: string }) {
    return {
      UserToken: withCorsOptions(name, createUserToken),
      SetCookie: withCorsOptions(name, createSetCookie),
      UserInfo: withCorsOptions(name, createUserInfo),
      Logout: withCorsOptions(name, createLogout),
      CreateResource: withCorsOptions(name, createCreateResource),
      ReadResource: withCorsOptions(name, createReadResource),
      ReadListResource: withCorsOptions(name, createReadResourceList),
      DeleteResource: withCorsOptions(name, createDeleteResource),
    };
  },
};

const withCorsOptions =
  <T extends (...args: any) => any>(
    name: string,
    fn: T
  ): ((options: CorsOptions) => ReturnType<T>) =>
  (options: CorsOptions) =>
    fn({ name, ...options });
