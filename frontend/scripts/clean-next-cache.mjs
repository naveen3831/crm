import { existsSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { basename, resolve } from "node:path";

const cacheName = process.argv[2] || ".next";

if (![".next", ".next-dev"].includes(basename(cacheName))) {
  console.error(`Refusing to remove unexpected Next cache directory: ${cacheName}`);
  process.exit(1);
}

const cacheDir = resolve(cacheName);

if (!existsSync(cacheDir)) {
  process.exit(0);
}

if (process.platform === "win32") {
  const escapedCacheDir = cacheDir.replaceAll("'", "''");
  spawnSync(
    "powershell.exe",
    [
      "-NoProfile",
      "-Command",
      `Remove-Item -LiteralPath '${escapedCacheDir}' -Recurse -Force -ErrorAction SilentlyContinue`,
    ],
    { cwd: process.cwd(), stdio: "inherit" },
  );

  process.exit(0);
}

rmSync(cacheDir, { recursive: true, force: true });
