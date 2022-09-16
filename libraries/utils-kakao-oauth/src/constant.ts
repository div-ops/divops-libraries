export const URLs = {
  로그인: "https://kauth.kakao.com/oauth/token",
  계정: "https://kapi.kakao.com/v2/user/me",
};

export const 인증방식 = {
  권한코드: "authorization_code",
  리프레시토큰: "refresh_token",
};

export const AxiosDefaultHeaders = {
  "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
};
