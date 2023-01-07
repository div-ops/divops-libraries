import { createGitHubOAuth } from "../../githubOAuth";
import { CorsOptions, NextApiRequest, NextApiResponse } from "../../types";
import { getAuthorization, parseQueryNumber, parseQueryStr } from "../utils";

interface Options extends CorsOptions {
  name: string;
}

export function createReadResourceList({ name, before }: Options) {
  return async function readResourceList(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    await before(req, res);

    try {
      const model = parseQueryStr(req, "model");
      const pageNo = parseQueryNumber(req, "pageNo", 1);
      const pageSize = parseQueryNumber(req, "pageSize", 10);

      const cryptedGitHubId = getAuthorization(req);

      if (cryptedGitHubId == null) {
        return res.json({ data: null });
      }

      const gitHubOAuth = createGitHubOAuth({ name });
      const githubId = gitHubOAuth.decryptGitHubID({ cryptedGitHubId });

      const { totalCount, data } = await gitHubOAuth.readResourceList({
        model,
        githubId,
      });

      return res.end({
        totalCount,
        data: data.slice((pageNo - 1) * pageSize, pageNo * pageSize),
      });
    } catch (error: any) {
      if (error.statusCode != null) {
        return res.status(400).end(error.message);
      }

      return res.status(500).json({
        message: error.message,
      });
    }
  };
}

/*
keyStore 에 List gist 의 key를 저장하고 있었는데, 이러면 유저마다 하나씩 만들어줘야함..ㅅㅂ
어떻게 하면 유저...어쩌지..ㅅㅂ거..

- 유저가 어떤 글을 써
  - 그 글의 카테고리를 맘대로 할 수 있게 했어
  - gist 의 종류는 사실
  - 리스트 gist 키: `gist-storage-${category}-${app-divops-kr}-${username}`

  - 글을 쓰다 (Create API)
    - 리스트 gist에 summary를 추가를 하고
      - 오류가 발생했다면, 새로 추가한다. 👈
    - 새로운 gist 를 추가
*/
