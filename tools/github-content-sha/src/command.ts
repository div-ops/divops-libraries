import { getGitHubContent } from "./get-github-content";
import { parseUrl } from "./parse-url";

export async function command({
  url,
  token,
  ref,
}: {
  url: string;
  token: string;
  ref?: string;
}) {
  const { owner, repo, target, hostname, protocol, port } = parseUrl(url);

  if (target.length === 1 && target[0] === "") {
    throw new Error("root directory is not supported");
  }

  const baseUrl = (() => {
    if (hostname === "github.com") {
      return `${protocol}//api.${hostname}${port !== "" ? `:${port}` : ``}`;
    }

    return `${protocol}//${hostname}${port !== "" ? `:${port}` : ``}/api/v3`;
  })();

  const context = {
    baseUrl,
    auth: token,
    owner,
    repo,
  };

  // 1. 파일이라면 파일의 sha를 가져온다.
  const content = await getGitHubContent(
    { path: target.join("/"), ref },
    context
  );

  // 1.a. 디렉토리가 아니라면 파일의 sha를 stdout으로 출력한다.
  if (!Array.isArray(content)) {
    console.log(content.sha);
    return;
  }

  // 2. 디렉토리라면 하위 파일들의 sha를 가져온다.
  const parentPath = target.slice(0, target.length - 1).join("/");
  const parentContent = await getGitHubContent(
    { path: parentPath, ref },
    context
  );

  if (!Array.isArray(parentContent)) {
    throw new Error(`parentContent${parentContent} is not directory`);
  }

  // 3. 하위 파일들에서 찾고자 하는 파일의 sha를 찾는다.
  const [childName] = target.slice(target.length - 1);
  const childContent = parentContent.find((x) => x.name === childName);

  if (childContent == null) {
    throw new Error(`parentPath(${parentPath}) does not contain ${childName}`);
  }

  // 3.a. 찾은 파일의 sha를 stdout으로 출력한다.
  console.log(childContent.sha);
}
