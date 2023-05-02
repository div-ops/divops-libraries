import {
  createResource,
  readResource,
  readResources,
  updateResource,
  deleteResource,
  fetchUser,
  loginUser,
} from "./apis";
import { GitHubOAuthSdkContext } from "./types";

/**
 * @name GitHubOAuthSdk
 * @example
 *
 * const { UserAPI, ResourceAPI } = GitHubOAuthSdk.of({
 *   baseUrl: 'https://app.divops.kr/github-api'
 *   getAuthorization: () => localStorage.getItem('Authorization'),
 * });
 *
 * await UserAPI.fetchUser();
 * UserAPI.loginUser();
 *
 * await ReosurceAPI.of({ model: "memory" }).read({ id });
 *
 */
export const GitHubOAuthSdk = {
  of: (context: GitHubOAuthSdkContext) => {
    return {
      UserAPI: {
        fetchUser: () => fetchUser(context),
        loginUser: () => loginUser(context),
      },
      ResourceAPI: {
        of: ({ model }: { model: string }) => ({
          create: <R, S>({ resource, summary }: { resource: R; summary: S }) =>
            createResource<R, S>({ model, resource, summary }, context),
          read: ({ id }: { id: string }) =>
            readResource({ model, id }, context),
          readList: ({
            pageNo = 1,
            pageSize = 10,
          }: { pageNo?: number; pageSize?: number } = {}) =>
            readResources({ model, pageNo, pageSize }, context),
          update: <R, S>({
            id,
            resource,
            summary,
          }: {
            id: string;
            resource: R;
            summary: S;
          }) => updateResource<R, S>({ model, id, resource, summary }, context),
          delete: ({ id }: { id: string }) =>
            deleteResource({ model, id }, context),
        }),
      },
    };
  },
};
