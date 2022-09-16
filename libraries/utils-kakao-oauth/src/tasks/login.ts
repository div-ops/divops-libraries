import { KakaoAccount, KakaoOAuthContext, KakaoToken } from "../models";
import { getAccount } from "../operations/getAccount";
import { getToken } from "../operations/getToken";

interface LoginOptions {
  code: string;
  redirectUri: string;
}

interface KakaoLoginResponse {
  account: KakaoAccount;
  token: KakaoToken;
}

export async function login(
  options: LoginOptions,
  context: KakaoOAuthContext
): Promise<KakaoLoginResponse> {
  const token = await getToken(options, context);

  const account = await getAccount(token);

  return { account, token };
}
