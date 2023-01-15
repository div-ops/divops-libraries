import { useRouter } from "next/router";
import { useEffect } from "react";
import { guardBrowserEnvironment } from "../utils";

export function useRequestGitHubOAuth({ CLIENT_ID }: { CLIENT_ID: string }) {
  const router = useRouter();

  useEffect(() => {
    if (router == null || !router.isReady) {
      return;
    }

    const referrer = router.query.referrer;

    if (referrer == null || Array.isArray(referrer)) {
      setTimeout(() => {
        window.history.back();
      }, 3000);

      throw new Error("referrer of querystring is not defined.");
    }

    guardBrowserEnvironment();

    localStorage.setItem("referrer", referrer);

    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`
    );
  }, [router]);
}
