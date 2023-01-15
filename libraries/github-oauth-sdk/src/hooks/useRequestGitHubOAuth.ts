import Router from "next/router";
import { useEffect } from "react";
import { guardBrowserEnvironment } from "../utils";

export function useRequestGitHubOAuth({ CLIENT_ID }: { CLIENT_ID: string }) {
  useEffect(() => {
    if (Router == null || Router.isReady) {
      console.log({ Router, isReady: Router.isReady });
      return;
    }

    const referrer = Router.query.referrer;

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
  }, [Router]);
}
