import { KakaoToken } from "../models";
import { getAccount } from "../operations";

interface IsExpiredOptions {
  accessToken: KakaoToken["accessToken"];
}

export async function isExpired(options: IsExpiredOptions): Promise<boolean> {
  try {
    await getAccount({ accessToken: options.accessToken });

    return false;
  } catch (error: any) {
    // 만료된 토큰
    if (error.response?.data?.error_code === "KOE403") {
      return true;
    }

    // 아직 모르는 에러들인데, 규명되면 위에 추가해주어야 합니다.
    console.log(error.message);
    console.error(error.message);

    throw error;
  }
}
