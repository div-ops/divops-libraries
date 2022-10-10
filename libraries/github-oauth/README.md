# github-oauth

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
