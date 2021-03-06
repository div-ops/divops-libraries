import fs from "fs";
import path from "path";

const DEFAULT_PROFILE = "default";

function getUserDir() {
  if (fs.existsSync(`/Users/${process.env?.["USER"]}`)) {
    return `/Users/${process.env?.["USER"]}`;
  }

  return path.join(__dirname);
}

function getStoragePathFile({
  appName,
  profile,
  storageName,
}: {
  appName: string;
  profile: string;
  storageName: string;
}) {
  return path.join(
    getUserDir(),
    `.${appName}`,
    "storage-config",
    `STORAGE_PATH_${
      (profile === DEFAULT_PROFILE ? "" : `${profile.toUpperCase()}_`) +
      storageName.toUpperCase()
    }`
  );
}

async function getStoragePath({
  appName,
  profile,
  storageName,
}: {
  appName: string;
  profile: string;
  storageName: string;
}) {
  const storagePathFile = getStoragePathFile({ appName, profile, storageName });

  if (fs.existsSync(storagePathFile)) {
    return await fs.promises.readFile(storagePathFile, "utf8");
  }

  profile = profile === DEFAULT_PROFILE ? "" : profile;

  const storagePath = path.join(
    getUserDir(),
    `.${appName}`,
    "storage",
    profile,
    storageName
  );

  await fs.promises.mkdir(storagePath, { recursive: true });

  if (!fs.existsSync(path.dirname(storagePathFile))) {
    await fs.promises.mkdir(path.dirname(storagePathFile), { recursive: true });
  }

  await fs.promises.writeFile(storagePathFile, storagePath);

  return storagePath;
}

export function storageOf<T>({
  appName,
  profile: optionalProfile,
  name: storageName,
}: {
  appName: string;
  profile?: string;
  name: string;
}) {
  const profile = optionalProfile ?? DEFAULT_PROFILE;

  return {
    reset: async () => {
      try {
        await fs.promises.rm(
          await getStoragePath({ appName, profile, storageName }),
          {
            recursive: true,
          }
        );
        console.log(
          `${await getStoragePath({
            appName,
            profile,
            storageName,
          })} is removed`
        );
      } catch {
        //
      }
      try {
        await fs.promises.rm(
          path.join(
            getUserDir(),
            getStoragePathFile({ appName, profile, storageName })
          )
        );
        console.log(
          `${path.join(
            getUserDir(),
            getStoragePathFile({ appName, profile, storageName })
          )} is removed`
        );
      } catch {
        //
      }
    },

    set: async (key: string, value: T): Promise<T> => {
      const filePath = path.join(
        await getStoragePath({ appName, profile, storageName }),
        key
      );

      if (!fs.existsSync(path.dirname(filePath))) {
        await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
      }

      await fs.promises.writeFile(filePath, JSON.stringify(value));

      return value;
    },

    get: async (key: string): Promise<T | null> => {
      const filePath = path.join(
        await getStoragePath({ appName, profile, storageName }),
        key
      );

      if (fs.existsSync(filePath)) {
        return JSON.parse(await fs.promises.readFile(filePath, "utf8"));
      } else {
        return null;
      }
    },

    remove: async (key: string): Promise<string> => {
      const filePath = path.join(
        await getStoragePath({ appName, profile, storageName }),
        key
      );

      if (fs.existsSync(filePath)) {
        fs.promises.unlink(filePath);
      }

      return key;
    },
  };
}
