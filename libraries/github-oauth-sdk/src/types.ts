export interface GitHubOAuthSdkContext {
  baseUrl: string;
  getAuthorization: () => string;
}
