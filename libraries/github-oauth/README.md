# github-oauth

## 0. environments

```
CLIENT_ID = process.env.GITHUB_CLIENT_ID,
CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET,
REFERER_COOKIE_KEY = "referer",
OAUTH_COOKIE_KEY = "github-oauth",
```

## 1. usage

> pages/api/callback.tsx

```ts
import { gitHubOAuth } from "@divops/github-oauth";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  return gitHubOAuth.callback(req, res);
};
```

> pages/login.tsx

```ts
import { gitHubOAuth } from "@divops/github-oauth";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return gitHubOAuth.redirectToGitHubAuthPage(context.req, context.res);
};

export default () => {
  return <></>;
};
```

> pages/api/user.tsx

```ts
import { gitHubOAuth } from "@divops/github-oauth";
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const githubOauth = gitHubOAuth.findGitHubToken(req);

  if (!githubOauth) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { data } = await axios("https://api.github.com/user", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${githubOauth}`,
      },
    });

    return res.json({ data });
  } catch (error: any) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
```

# FLOW

```
FLOW

1. www.creco.services/github-editor/login 에서 로그인 버튼을 클릭
2. app.divops.kr/login/test-login 으로 이동됨
3. ☝️https://github.com/login/oauth/authorize 으로 이동시켜서 인증하게함
4. 인증 완료 후, https://app.divops.kr/login/callback 으로 이동
5. callback 페이지에서 code를 읽고 /login/api/user-token 를 호출
6. /login/api/user-token 에서는 POST /login/oauth/access_token 으로 accessToken을 구해서 header 로 내려줌
7. 응답 중 accessToken 를 code라는 쿼리 파라미터로 들고 www.creco.services/github-editor/login 로 돌아감
8. /github-editor/login 에서는 code 쿼리파라미터를 가지고 POST `https://app.divops.kr/login/api/set-token` 을 요청하는 예시 API 를 호출

```
