import { KakaoOAuthContext, KakaoToken } from "../models";
import { renewToken } from "../operations/renewToken";

export async function refresh(
  { refreshToken }: Pick<KakaoToken, "refreshToken">,
  context: KakaoOAuthContext
): Promise<KakaoToken> {
  return await renewToken({ refreshToken }, context);
}
