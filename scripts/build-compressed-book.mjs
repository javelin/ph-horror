import fs from "node:fs/promises";

const root = new URL("../", import.meta.url);
const sourceDirectory = new URL("transcription/pages/", root);
const compressedDirectory = new URL("compressed/", root);
const compressedPagesDirectory = new URL("compressed/pages/", root);

// These pages contain no recoverable heading or prose. Keeping each one as a
// standalone compressed page prevents it from being mistaken for a continuation
// of the preceding topic.
const standaloneUnclearPages = new Set([16, 26, 46, 60, 82, 96, 110]);

const sectionHeaders = new Set([
  "Mga Lamánlupà",
  "Mga Halímaw",
  "Mga Aswáng",
  "Mga Bayáni",
  "Mga Aníto",
  "Mga Diwatà",
  "Mga Bathalà",
]);

function csv(value) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function stripSourceMarker(text) {
  return text.replace(
    /^<!-- original-page: \d+ \| source: (?:odd|even)-\d{3} -->\s*/u,
    "",
  );
}

function stripPrintedFooter(text) {
  return text
    .split("\n")
    .filter(
      (line) =>
        !/^\s*(?:\d+\s+\|\s+\p{Lu}[\p{Lu}\p{M}\s]*|\p{Lu}[\p{Lu}\p{M}\s]*\s+\|\s+\d+)\s*$/u.test(
          line,
        ),
    )
    .join("\n")
    .trim();
}

function splitAtTopicHeadings(text) {
  const matches = [...text.matchAll(/^# (.+)$/gmu)];
  if (matches.length === 0) {
    return [];
  }

  return matches.map((match, index) => {
    const start = match.index;
    const end = matches[index + 1]?.index ?? text.length;
    return {
      title: match[1].trim(),
      text: text.slice(start, end).trim(),
    };
  });
}

function titleForUnclearPage(page) {
  return `Hindi mabása: pahina ${page}`;
}

function extractTrailingArtifacts(fragment) {
  const artifacts = [];
  let prose = fragment.trim();
  const artifactPattern = /\n\n(_\[[^\n]+\]_)$/u;

  while (artifactPattern.test(prose)) {
    const match = prose.match(artifactPattern);
    artifacts.unshift(match[1]);
    prose = prose.slice(0, match.index).trimEnd();
  }

  return { prose, artifacts };
}

function joinTopicFragments(fragments) {
  const proseFragments = [];
  const artifacts = [];

  for (const fragment of fragments) {
    const extracted = extractTrailingArtifacts(fragment);
    proseFragments.push(extracted.prose);
    artifacts.push(...extracted.artifacts);
  }

  let body = proseFragments.shift() ?? "";
  for (const next of proseFragments) {
    const previousCharacter = body.trimEnd().at(-1) ?? "";
    const nextCharacter = next.trimStart().at(0) ?? "";
    const isInterruptedSentence =
      previousCharacter !== "" &&
      nextCharacter !== "" &&
      !/[.!?…:;”"'’)\]]/u.test(previousCharacter) &&
      /^\p{Ll}$/u.test(nextCharacter);

    body += isInterruptedSentence
      ? `\n${next.trimStart()}`
      : `\n\n${next.trim()}`;
  }

  if (artifacts.length > 0) {
    body += `\n\n${artifacts.join("\n\n")}`;
  }

  return body.trim();
}

const sourceFiles = (await fs.readdir(sourceDirectory))
  .filter((name) => /^\d{4}\.md$/u.test(name))
  .sort();

const topics = [];
let currentTopic;

for (const sourceFile of sourceFiles) {
  const originalPage = Number.parseInt(sourceFile.slice(0, 4), 10);
  const raw = await fs.readFile(new URL(sourceFile, sourceDirectory), "utf8");
  const cleaned = stripPrintedFooter(stripSourceMarker(raw));
  const fragments = splitAtTopicHeadings(cleaned);

  if (fragments.length > 0) {
    for (const fragment of fragments) {
      currentTopic = {
        title: fragment.title,
        originalPages: [originalPage],
        fragments: [fragment.text],
        splitFromSharedPage: fragments.length > 1,
      };
      topics.push(currentTopic);
    }
    continue;
  }

  if (standaloneUnclearPages.has(originalPage)) {
    currentTopic = {
      title: titleForUnclearPage(originalPage),
      originalPages: [originalPage],
      fragments: [`# ${titleForUnclearPage(originalPage)}\n\n${cleaned}`],
      unclear: true,
    };
    topics.push(currentTopic);
    continue;
  }

  if (!currentTopic) {
    throw new Error(`No topic available for continuation page ${originalPage}`);
  }

  currentTopic.originalPages.push(originalPage);
  currentTopic.fragments.push(cleaned);
}

await fs.rm(compressedPagesDirectory, { recursive: true, force: true });
await fs.mkdir(compressedPagesDirectory, { recursive: true });

const mapRows = [
  [
    "compressed_page",
    "file",
    "title",
    "original_pages",
    "notes",
  ],
];
const assembledPages = [];

for (const [index, topic] of topics.entries()) {
  const compressedPage = index + 1;
  const filename = `${String(compressedPage).padStart(4, "0")}.md`;
  const originalPages = topic.originalPages.join(";");
  const notes = [];

  if (sectionHeaders.has(topic.title)) {
    notes.push("section header");
  }
  if (topic.originalPages.length > 1) {
    notes.push("merged original pages");
  }
  if (topic.splitFromSharedPage) {
    notes.push("split from shared original page");
  }
  if (topic.unclear) {
    notes.push("unreadable source placeholder");
  }
  if (topic.fragments.some((fragment) => fragment.includes("Pahinang larawan"))) {
    notes.push("includes illustration-only page placeholder");
  }

  const body = joinTopicFragments(topic.fragments.filter(Boolean));
  const marker =
    `<!-- compressed-page: ${compressedPage} | ` +
    `original-pages: ${originalPages} -->`;
  const pageText = `${marker}\n\n${body}\n`;

  await fs.writeFile(
    new URL(filename, compressedPagesDirectory),
    pageText,
    "utf8",
  );
  assembledPages.push(pageText.trim());
  mapRows.push([
    compressedPage,
    `pages/${filename}`,
    topic.title,
    originalPages,
    notes.join("; "),
  ]);
}

await fs.writeFile(
  new URL("page-map.csv", compressedDirectory),
  `${mapRows.map((row) => row.map(csv).join(",")).join("\n")}\n`,
  "utf8",
);

const frontMatter = await fs.readFile(
  new URL("transcription/book.md", root),
  "utf8",
);
const compressedFrontMatter = frontMatter.replace(
  "> Text-only diplomatic transcription. Illustrations are omitted. Original page\n> boundaries are retained.",
  "> Text-only compressed edition. Illustrations are omitted. Related entries are\n> consolidated by topic; original-page mapping is in `compressed/page-map.csv`.",
);
await fs.writeFile(
  new URL("book.md", compressedDirectory),
  `${compressedFrontMatter.trim()}\n\n${assembledPages.join(
    "\n\n<div style=\"page-break-after: always;\"></div>\n\n",
  )}\n`,
  "utf8",
);

console.log(
  `Built ${topics.length} compressed topic pages from ${sourceFiles.length} original pages`,
);
