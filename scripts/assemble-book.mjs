import fs from "node:fs/promises";
import path from "node:path";

const root = new URL("../", import.meta.url);
const frontMatter = await fs.readFile(new URL("transcription/book.md", root), "utf8");
const pagesDirectory = new URL("transcription/pages/", root);
const pageFiles = (await fs.readdir(pagesDirectory))
  .filter((name) => /^\d{4}\.md$/.test(name))
  .sort();

const pages = [];
for (const pageFile of pageFiles) {
  pages.push((await fs.readFile(new URL(pageFile, pagesDirectory), "utf8")).trim());
}

const outputDirectory = new URL("output/", root);
await fs.mkdir(outputDirectory, { recursive: true });
await fs.writeFile(
  new URL("book.md", outputDirectory),
  `${frontMatter.trim()}\n\n${pages.join("\n\n<div style=\"page-break-after: always;\"></div>\n\n")}\n`,
);

console.log(`Assembled ${pageFiles.length} numbered pages into output/book.md`);

