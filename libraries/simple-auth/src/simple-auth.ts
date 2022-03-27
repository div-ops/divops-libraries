import * as util from "util";
import * as crypto from "crypto";
import { Request } from "express";

const randomBytesPromise = util.promisify(crypto.randomBytes);

const pbkdf2Promise = util.promisify(crypto.pbkdf2);

enum KEY_MAP {
  SALT = "sa",
  AUTHORIZATION = "au",
}

const createSimpleAuth = ({ masterPassword }: { masterPassword: string }) => {
  const ONE_MONTH = 2592000;

  if (masterPassword == null) {
    throw new Error("masterPassword가 설정되지 않았습니다.");
  }

  const simpleAuth = {
    createSalt: async (): Promise<string> => {
      return (await randomBytesPromise(64)).toString("base64");
    },

    verifyPassword: async (
      password,
      userSalt,
      userPassword
    ): Promise<boolean> => {
      const key = await pbkdf2Promise(password, userSalt, 104906, 64, "sha512");

      return key.toString("base64") === userPassword;
    },

    encodePassword: async (
      password: string
    ): Promise<{ encoded: string; salt: string }> => {
      const salt = await simpleAuth.createSalt();

      const key = await pbkdf2Promise(password, salt, 104906, 64, "sha512");

      const encoded = key.toString("base64");

      return { encoded, salt };
    },

    validator: async function (req: Request) {
      const token = {};

      try {
        if (req.headers.cookie == null) {
          throw new Error(`Not Authorization(cookie is not defined)`);
        }

        const cookies = req.headers.cookie.split(";").map((e) => e.trim());
        const keyList = Object.keys(KEY_MAP).map((key) => KEY_MAP[key]);

        for (const cookie of cookies) {
          if (keyList.includes(cookie.split("=")[0])) {
            token[cookie.split("=")[0]] = cookie.substring(3);
          }
        }

        if (
          !(await simpleAuth.verifyPassword(
            masterPassword,
            token[KEY_MAP.SALT],
            token[KEY_MAP.AUTHORIZATION]
          ))
        ) {
          throw new Error(`Not Authorization(token: ${token})`);
        }

        return true;
      } catch (e) {
        if (!e.message.includes("'headers' of undefined")) {
          console.error(e.message);
        }
        throw new Error(`Not Authorization(${e.message})`);
      }
    },

    isAdmin: async function (req: Request) {
      try {
        return await simpleAuth.validator(req);
      } catch (error) {
        return false;
      }
    },

    setToken: async function (res, salt, hash) {
      res.setHeader("Set-Cookie", [
        `${KEY_MAP.AUTHORIZATION}=${hash}; Max-Age=${ONE_MONTH}; path=/; Secure; HttpOnly; SameSite=none`,
        `${KEY_MAP.SALT}=${salt}; Max-Age=${ONE_MONTH}; path=/; Secure; HttpOnly; SameSite=none`,
      ]);
    },
  };

  return simpleAuth;
};

export default createSimpleAuth;