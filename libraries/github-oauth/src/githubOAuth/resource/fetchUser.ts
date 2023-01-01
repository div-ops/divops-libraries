import axios from "axios";

export async function fetchUser({ accessToken }: { accessToken: string }) {
  const { data } = await axios({
    method: "get",
    url: `https://api.github.com/user`,
    headers: {
      accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data;
}
