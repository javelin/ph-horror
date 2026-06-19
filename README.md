# 101 Kagila-gilalás na Nilaláng

This repository contains a page-preserving, text-only transcription of the
Filipino book *101 Kagila-gilalás na Nilaláng*.

The transcription preserves the wording, spelling, punctuation, and printed
pagination of the source. Illustrations are intentionally omitted.

## Repository layout

- `transcription/book.md` - the readable master transcription
- `transcription/pages/` - verified body pages stored by printed page number
- `metadata/page-map.csv` - correspondence between source scans and book pages
- `docs/transcription-policy.md` - editorial and uncertainty conventions

Generated PDF, DOCX, and EPUB editions will be placed in `output/` and are not
committed unless explicitly selected as release artifacts.

To assemble the front matter and all numbered page files into one Markdown
document:

```sh
node scripts/assemble-book.mjs
```

Validate page markers and source-scan uniqueness with:

```sh
node scripts/validate-transcription.mjs
```
