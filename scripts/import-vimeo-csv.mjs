/**
 * Zoom-to-Vimeo の vimeo_metadata_export.csv から gallery 用の TypeScript を生成する。
 * 用法: node scripts/import-vimeo-csv.mjs [csvパス]
 * 既定: リポジトリ code4biz 直下の ZOOM to VIMEO/vimeo_metadata_export.csv
 */
import { parse } from "csv-parse/sync";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootGallery = path.join(__dirname, "..");
const defaultCsv = path.join(
  rootGallery,
  "..",
  "..",
  "ZOOM to VIMEO",
  "vimeo_metadata_export.csv",
);

const csvPath = path.resolve(process.argv[2] || defaultCsv);
const outPath = path.join(rootGallery, "lib", "galleryVideos.generated.ts");

if (!fs.existsSync(csvPath)) {
  console.error(`CSV が見つかりません: ${csvPath}`);
  console.error("例: node scripts/import-vimeo-csv.mjs \"D:\\\\path\\\\to\\\\vimeo_metadata_export.csv\"");
  process.exit(1);
}

const raw = fs.readFileSync(csvPath, "utf8");
const rows = parse(raw, {
  columns: (headers) =>
    headers.map((h) => String(h).replace(/^\uFEFF/, "").trim()),
  skip_empty_lines: true,
  relax_quotes: true,
  trim: true,
});

const col = {
  name: "講師名（英語）",
  dept: "専門科",
  lecture: "レクチャータイトル（英語）",
  title: "配信用動画タイトル",
  link: "Vimeo動画のlink",
};

const seen = new Set();
const videos = [];

for (const row of rows) {
  const link = (row[col.link] || "").trim();
  const m = link.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (!m) continue;
  const id = m[1];
  if (seen.has(id)) continue;
  seen.add(id);

  const title = (row[col.title] || "").trim() || `Video ${id}`;
  const name = (row[col.name] || "").trim();
  const dept = (row[col.dept] || "").trim();
  const lecture = (row[col.lecture] || "").trim();
  const descParts = [name && dept ? `${name}（${dept}）` : name || dept, lecture].filter(
    Boolean,
  );
  const description = descParts.join(" — ") || " ";

  videos.push({
    id,
    title,
    thumbnail: `https://vumbnail.com/${id}.jpg`,
    description,
  });
}

const header = `/* 自動生成: npm run gallery:import（編集しない） */\nimport type { Video } from "./videos";\n\n`;
const body = `export const videos: Video[] = ${JSON.stringify(videos, null, 2)};\n`;
fs.writeFileSync(outPath, header + body, "utf8");

console.log(`Wrote ${videos.length} videos → ${outPath}`);
