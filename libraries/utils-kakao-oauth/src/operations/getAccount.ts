import { AxiosDefaultHeaders, URLs } from "../constant";
import { KakaoAccount, KakaoToken } from "../models";
import axios from "axios";

export async function getAccount({
  accessToken,
}: Pick<KakaoToken, "accessToken">): Promise<KakaoAccount> {
  const { data } = await axios.get(URLs.계정, {
    headers: {
      ...AxiosDefaultHeaders,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return { id: data.id };
}
