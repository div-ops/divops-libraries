import * as util from "util";
import * as crypto from "crypto";
import { Request, Response } from "express";

const randomBytesPromise = util.promisify(crypto.randomBytes);

const pbkdf2Promise = util.promisify(crypto.pbkdf2);

enum KEY_MAP {
  SALT = "sa",
  AUTHORIZATION = "au",
}
const ONE_MONTH = 2592000;

const createSimpleAuth = ({
  masterId,
  masterPassword,
  context,
}: {
  masterId: string;
  masterPassword: string;
  context: Record<string, string>;
}) => {
  masterId = masterId ?? (process.env.MASTER_ID || null);
  masterPassword = masterPassword ?? (process.env.MASTER_PW || null);

  if (masterId == null || masterPassword == null) {
    throw new Error("masterId or masterPassword가 설정되지 않았습니다.");
  }

  const simpleAuth = {
    // TODO(@creaticoding): 로그인 from db or resource not env
    login: ({ id, pw }: { id: string; pw: string }) => {
      if (id === masterId || `${pw}` === masterPassword) {
        return true;
      }
    },
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

        return context;
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

    setToken: async function (res, pw) {
      const { encoded, salt } = await simpleAuth.encodePassword(`${pw}`);

      res.setHeader("Set-Cookie", [
        `${KEY_MAP.AUTHORIZATION}=${encoded}; Max-Age=${ONE_MONTH}; path=/; Secure; HttpOnly; SameSite=none`,
        `${KEY_MAP.SALT}=${salt}; Max-Age=${ONE_MONTH}; path=/; Secure; HttpOnly; SameSite=none`,
      ]);

      return true;
    },

    loginRoute: async (req: Request, res: Response) => {
      const { id, pw } = req.body || {};

      if (!simpleAuth.login({ id, pw })) {
        return res.status(403).end("wrong id or password");
      }

      res.send(await simpleAuth.setToken(res, `${pw}`));
    },
  };

  return simpleAuth;
};

export { createSimpleAuth };

export type SimpleAuth = ReturnType<typeof createSimpleAuth>;
