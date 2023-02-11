import { getBaseUrl, createAuthHeaders } from "../../../utils";

export const login = () => {
  location.assign(`${getBaseUrl()}/request?referrer=${location.href}`);
};
