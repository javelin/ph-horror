import fs from "node:fs/promises";

const root = new URL("../", import.meta.url);
const pagesDirectory = new URL("transcription/pages/", root);
const pageFiles = (await fs.readdir(pagesDirectory))
  .filter((name) => /^\d{4}\.md$/.test(name))
  .sort();
const seenSources = new Set();
const errors = [];

for (const pageFile of pageFiles) {
  const text = await fs.readFile(new URL(pageFile, pagesDirectory), "utf8");
  const marker = text.match(
    /^<!-- original-page: (\d+) \| source: ((?:odd|even)-\d{3}) -->/m,
  );
  if (!marker) {
    errors.push(`${pageFile}: missing or malformed page marker`);
    continue;
  }

  const filePage = Number.parseInt(pageFile.slice(0, 4), 10);
  const markerPage = Number.parseInt(marker[1], 10);
  if (filePage !== markerPage) {
    errors.push(`${pageFile}: marker says original page ${markerPage}`);
  }
  if (seenSources.has(marker[2])) {
    errors.push(`${pageFile}: duplicate source ${marker[2]}`);
  }
  seenSources.add(marker[2]);
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${pageFiles.length} numbered transcription pages`);
}

