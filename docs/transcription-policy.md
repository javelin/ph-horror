# Transcription policy

## Aim

The master text is a diplomatic transcription: it records what the original
book prints, page by page, without modernizing the Filipino or silently
correcting the author and editor.

Illustrations and decorative elements are omitted. Text that forms part of an
illustration is recorded only when it contributes substantive book content.

## Pagination

Each physical book page begins with an HTML comment:

```text
<!-- original-page: 17 | source: odd-012 -->
```

The marker identifies both the original printed page and the exact source scan.
Unnumbered preliminary and closing pages use stable labels such as `front-01`
and `back-01`.

A page break follows every physical book page. Consequently, fixed-layout
exports can keep one digital page for each original physical page.

## Spelling and punctuation

- Preserve original spelling, capitalization, accents, and punctuation.
- Preserve apparent typographical errors and mark them with `[sic]` only when
  readers might otherwise mistake them for transcription errors.
- Do not expand abbreviations.
- Preserve paragraph boundaries.
- Represent small capitals as ordinary capitals when Markdown cannot encode
  the distinction reliably.
- Do not reproduce line-end hyphenation unless the hyphen belongs to the word.

## Uncertain or damaged text

- `[hindi mabasa]` - text is present but cannot be read.
- `[hindi mabasa: 3 salita]` - estimated amount of unreadable text.
- `[salita?]` - a probable but uncertain reading.
- `[kulang ang scan]` - the source scan does not contain the complete text.
- `[blangkong pahina]` - an intentionally retained blank page.

Uncertain readings must remain visible until independently checked. They must
never be silently guessed from context.

## Corrections and review

Every transcribed page should pass two checks:

1. Character-level comparison against the source scan.
2. Reading-order comparison against the preceding and following pages.

The page map records progress using `unreviewed`, `transcribed`, `checked`, or
`blocked`.

