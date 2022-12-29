import crypto from "crypto";

const algorithm = "aes-256-cbc";
const iv = crypto.randomBytes(16);

function randomString(size: number) {
  return crypto.randomBytes(240).toString("base64").slice(0, size);
}

export function encrypt(plain: string) {
  const password = randomString(99);
  const specialSalt = Buffer.from(Date.now().toString().slice(0, 10)).toString(
    "base64"
  );
  const key = crypto.scryptSync(password, specialSalt, 32, { N: 128 });
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const result =
    cipher.update(plain, "utf8", "base64") + cipher.final("base64");

  // 99 자리 + 16 자리 + 실제 encodedToken
  return `${password}${specialSalt}${result}`;
}

export function decrypt(encoded: string) {
  const password = encoded.slice(0, 99);
  const specialSalt = encoded.slice(99, 115);
  const token = encoded.slice(115);

  const key = crypto.scryptSync(password, specialSalt, 32, { N: 128 });
  const deciper = crypto.createDecipheriv(algorithm, key, iv);
  const result =
    deciper.update(token, "base64", "utf8") + deciper.final("utf8");

  return result;
}
