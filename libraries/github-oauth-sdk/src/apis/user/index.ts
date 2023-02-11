import { fetchUser } from "./fetchUser";
import { loginUser } from "./loginUser";

export const UserAPI = {
  of: () => {
    return {
      fetchUser: () => fetchUser(),
      loginUser: () => loginUser(),
    };
  },
};
