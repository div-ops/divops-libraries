import { getBaseUrl } from "../../utils";

export const loginUser = () => {
  location.assign(`${getBaseUrl()}/request?referrer=${location.href}`);
};
