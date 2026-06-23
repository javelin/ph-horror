import fs from "node:fs/promises";

const root = new URL("../", import.meta.url);
const pagesDirectory = new URL("compressed/pages/", root);
const pageMapUrl = new URL("compressed/page-map.csv", root);
const errors = [];
const categories = new Set([
  "LAMÁNLUPÀ",
  "HALÍMAW",
  "ASWÁNG",
  "BAYÁNI",
  "ANÍTO",
  "DIWATÀ",
  "BATHALÀ",
]);

const pageFiles = (await fs.readdir(pagesDirectory))
  .filter((name) => /^\d{4}\.md$/u.test(name))
  .sort();

const coveredOriginalPages = [];

for (const pageFile of pageFiles) {
  const text = await fs.readFile(new URL(pageFile, pagesDirectory), "utf8");
  const marker = text.match(
    /^<!-- compressed-page: (\d+) \| original-pages: ([\d;]+) -->/mu,
  );
  if (!marker) {
    errors.push(`${pageFile}: missing or malformed compressed-page marker`);
    continue;
  }

  const filePage = Number.parseInt(pageFile.slice(0, 4), 10);
  const markerPage = Number.parseInt(marker[1], 10);
  if (filePage !== markerPage) {
    errors.push(`${pageFile}: marker says compressed page ${markerPage}`);
  }

  const headings = text.match(/^# .+$/gmu) ?? [];
  if (headings.length !== 1) {
    errors.push(`${pageFile}: expected one topic heading, found ${headings.length}`);
  }

  const footer = text.trim().split("\n").at(-1);
  if (!categories.has(footer)) {
    errors.push(`${pageFile}: missing or invalid category footer`);
  }

  for (const originalPage of marker[2].split(";")) {
    coveredOriginalPages.push(Number.parseInt(originalPage, 10));
  }
}

const covered = new Set(coveredOriginalPages);
for (let page = 9; page <= 128; page += 1) {
  if (!covered.has(page)) {
    errors.push(`original page ${page} is not represented`);
  }
}

const mapText = await fs.readFile(pageMapUrl, "utf8");
const mapRows = mapText.trim().split("\n");
if (mapRows.length !== pageFiles.length + 1) {
  errors.push(
    `page-map.csv has ${mapRows.length - 1} data rows for ${pageFiles.length} pages`,
  );
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Validated ${pageFiles.length} compressed pages covering original pages 9–128`,
  );
}
