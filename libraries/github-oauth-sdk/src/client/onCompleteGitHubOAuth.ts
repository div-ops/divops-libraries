import { guardBrowserEnvironment } from "./utils";

/**
 * @name onCompleteGitHubOAuth
 * @param url "/login/api/user-token"
 * @param code GitHub에서 얻은 code 값
 */
export async function onCompleteGitHubOAuth({
  url,
  code,
}: {
  url: string;
  code: string;
}) {
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

  const Authorization = response.headers.get("Authorization");
  console.log({ Authorization });
  const [, token] = Authorization.split(" ");

  const referrer = localStorage.getItem("referrer");

  localStorage.removeItem("referrer");

  if (!token || !referrer) {
    alert("잘못된 접근인데, 어떻게 오셨어요? 다시 접근해보세용!");
    setTimeout(() => {
      window.history.back();
    }, 3000);
    return;
  }

  if (referrer.includes("?")) {
    window.location.assign(
      `${referrer}${`&code=${window.btoa(encodeURIComponent(token))}`}`
    );
  } else {
    window.location.assign(
      `${referrer}${`?code=${window.btoa(encodeURIComponent(token))}`}`
    );
  }
}
