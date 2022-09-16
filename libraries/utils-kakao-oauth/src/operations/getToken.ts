import { KakaoOAuthContext, KakaoToken } from "../models";
import { AxiosDefaultHeaders, URLs, 인증방식 } from "../constant";
import axios from "axios";

interface GetTokenOptions {
  code: string;
  redirectUri: string;
}

export async function getToken(
  options: GetTokenOptions,
  context: KakaoOAuthContext
): Promise<KakaoToken> {
  const { data } = await axios.post(
    URLs.로그인,
    new URLSearchParams({
      grant_type: 인증방식.권한코드,
      code: options.code,
      redirect_uri: options.redirectUri,
      client_id: context.clientId,
      client_secret: context.clientSecret,
    }),
    { headers: AxiosDefaultHeaders }
  );

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  };
}
