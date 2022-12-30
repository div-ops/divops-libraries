import { guardBrowserEnvironment } from "./utils";

export async function onCompleteGitHubOAuth({ code }: { code: string }) {
  guardBrowserEnvironment();

  const response = await fetch("/login/api/user-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
    }),
  });

  const Authorization = response.headers.get("Authorization");

  const referrer = localStorage.getItem("referrer");
  localStorage.removeItem("referrer");

  if (!Authorization || !referrer) {
    alert("잘못된 접근인데, 어떻게 오셨어요? 다시 접근해보세용!");
    setTimeout(() => {
      window.history.back();
    }, 3000);
    return;
  }

  if (referrer.includes("?")) {
    window.location.assign(
      `${referrer}${`&code=${window.btoa(encodeURIComponent(Authorization))}`}`
    );
  } else {
    window.location.assign(
      `${referrer}${`?code=${window.btoa(encodeURIComponent(Authorization))}`}`
    );
  }
}
