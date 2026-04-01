/**
 * Vercel ビルド時などに、GitHub 上の vimeo_metadata_export.csv を取り込み
 * `import-vimeo-csv.mjs` で lib/galleryVideos.generated.ts を生成する。
 *
 * 実行条件（どれか）:
 * - 環境変数 VERCEL=1（Vercel のビルドでは自動で付与）
 * - または VIMEO_METADATA_CSV_URL を明示指定
 *
 * オプション:
 * - SKIP_REMOTE_CSV=1 … 常にスキップ（コミット済み TS のみでビールド）
 *
 * Zoom-to-Vimeo で CSV を push したあと Vercel を更新するには、
 * そのリポジトリに Deploy Hook を叩く GitHub Actions を置く（下記参照）。
 */
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootGallery = path.join(__dirname, "..");

const DEFAULT_CSV_URL =
  "https://raw.githubusercontent.com/Kosoko-Hidefumi/Zoom-to-Vimeo/main/vimeo_metadata_export.csv";

function shouldFetch() {
  if (process.env.SKIP_REMOTE_CSV === "1") return false;
  if (process.env.VIMEO_METADATA_CSV_URL) return true;
  if (process.env.VERCEL === "1") return true;
  return false;
}

async function main() {
  if (!shouldFetch()) {
    console.log(
      "[fetch-and-import] Skipped: use committed lib/galleryVideos.generated.ts (not on Vercel, and VIMEO_METADATA_CSV_URL unset).",
    );
    return;
  }

  const url = process.env.VIMEO_METADATA_CSV_URL?.trim() || DEFAULT_CSV_URL;
  console.log("[fetch-and-import] Fetching CSV:", url);

  const res = await fetch(url);
  if (!res.ok) {
    console.error("[fetch-and-import] HTTP", res.status, res.statusText);
    process.exit(1);
  }

  const cacheDir = path.join(rootGallery, ".cache");
  fs.mkdirSync(cacheDir, { recursive: true });
  const tmp = path.join(cacheDir, "vimeo_metadata_export.csv");
  fs.writeFileSync(tmp, await res.text(), "utf8");

  const r = spawnSync(process.execPath, [path.join(__dirname, "import-vimeo-csv.mjs"), tmp], {
    cwd: rootGallery,
    stdio: "inherit",
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
