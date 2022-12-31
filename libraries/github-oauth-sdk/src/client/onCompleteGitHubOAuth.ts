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
    window.location.assign(`${referrer}${`&code=${token}`}`);
  } else {
    window.location.assign(`${referrer}${`?code=${token}`}`);
  }
}
