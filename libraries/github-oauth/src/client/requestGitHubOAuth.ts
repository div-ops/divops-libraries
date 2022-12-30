import { guardBrowserEnvironment } from "./utils";

export function requestGitHubOAuth({
  referrer,
  CLIENT_ID,
}: {
  referrer: string;
  CLIENT_ID: string;
}) {
  guardBrowserEnvironment();

  localStorage.setItem("referrer", referrer);

  window.location.assign(
    `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`
  );
}
