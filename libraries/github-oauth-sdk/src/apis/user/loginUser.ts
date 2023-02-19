import { GitHubOAuthSdkContext } from "../../types";

export const loginUser = ({ baseUrl }: GitHubOAuthSdkContext) => {
  location.assign(`${baseUrl}/request?referrer=${location.href}`);
};
