import { useRouter } from "next/router";
import { useEffect } from "react";
import { guardBrowserEnvironment } from "../utils";

export function useCallbackGitHubOAuth({ url }: { url: string }) {
  const router = useRouter();

  useEffect(() => {
    if (router == null || !router.isReady) {
      console.log({ router, isReady: router.isReady });
      return;
    }

    const code = router.query.code;

    if (code == null || Array.isArray(code)) {
      alert("잘못된 접근인데, 어떻게 오셨어요? 다시 접근해보세용! 2");
      setTimeout(() => {
        window.history.back();
      }, 3000);
      return;
    }

    (async () => {
      guardBrowserEnvironment();

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
        }),
      });

      const token = response.headers.get("Authorization");

      const referrer = localStorage.getItem("referrer");

      localStorage.removeItem("referrer");

      if (!token || !referrer) {
        alert("Not Authorized. (!token || !referrer)");

        setTimeout(() => {
          window.history.back();
        }, 3000);
        return;
      }

      if (referrer.includes("?")) {
        window.location.assign(
          `${referrer}${`&code=${encodeURIComponent(token)}`}`
        );
      } else {
        window.location.assign(
          `${referrer}${`?code=${encodeURIComponent(token)}`}`
        );
      }
    })();
  }, [router]);
}
