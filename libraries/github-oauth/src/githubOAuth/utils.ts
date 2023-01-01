import { createGistJSONStorage } from "@divops/gist-storage";
import { decrypt } from "@divops/simple-crypto";

export async function getUserFromUserPool({
  key,
  gistStorage,
  userPoolKey,
}: {
  key: string;
  gistStorage: ReturnType<typeof createGistJSONStorage>;
  userPoolKey: string;
}) {
  const userPool = await gistStorage.find<any>(userPoolKey);

  return userPool[key];
}

export async function getAuthorization(options: {
  key: string;
  gistStorage: ReturnType<typeof createGistJSONStorage>;
  userPoolKey: string;
  cryptoSecret: Buffer;
}) {
  const user = await getUserFromUserPool(options);

  return decrypt(user.accessToken, { iv: options.cryptoSecret });
}
