import { KakaoOAuthContext, KakaoToken } from "../models";
import { AxiosDefaultHeaders, URLs, 인증방식 } from "../constant";
import axios from "axios";

interface RefreshTokenOptions {
  refreshToken: string;
}

export async function renewToken(
  options: RefreshTokenOptions,
  context: KakaoOAuthContext
): Promise<KakaoToken> {
  const { data } = await axios.post(
    URLs.로그인,
    new URLSearchParams({
      grant_type: 인증방식.리프레시토큰,
      refresh_token: options.refreshToken,
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
