import { Octokit } from "@octokit/rest";

export interface FindGistOptions {
  id: string;
  octokit: Octokit;
}
