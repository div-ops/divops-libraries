import { Octokit } from "@octokit/rest";

interface GitHubContent {
  name: string;
  path: string;
  sha: string;
}

export async function getGitHubContent(
  { path, ref }: { path: string; ref: string | undefined },
  context: { owner: string; repo: string; baseUrl: string; auth: string }
): Promise<GitHubContent | GitHubContent[]> {
  const octokit = new Octokit(context);

  const { owner, repo } = context;

  const { data } = await octokit.repos.getContent({
    owner,
    repo,
    path,
    ref,
  });

  if (!Array.isArray(data)) {
    return data as GitHubContent;
  }

  return data as GitHubContent[];
}
