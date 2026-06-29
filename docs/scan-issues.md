# Scan issues register

This document tracks source pages that appear incomplete, damaged, illegible,
duplicated, or otherwise unreliable for transcription. It is intended for
comparison with the original physical book.

The source ID is the one-based page position inside a source PDF:

- `odd-NNN` - odd-page scan batch
- `even-NNN` - even-page scan batch

Printed page numbers are included when they have been verified. `Unknown`
means that the scan has not yet been mapped confidently.

## Confirmed text-affecting defects

| Source scan | Printed page | Severity | Problem | Transcription impact | Resolution |
| --- | ---: | --- | --- | --- | --- |
| `even-072` | 16 | Critical | Almost the entire page is washed out and illegible. | No trustworthy transcription is currently possible. | Rescan or photograph printed page 16. |

## Manuscript-reviewed resolutions

These pages were reviewed against the physical manuscript and are no longer
treated as missing text.

| Source scan | Printed page | Review result | Transcription action |
| --- | ---: | --- | --- |
| `even-075` | 10 | The cut-off sentence ends: “Humuhuni na tulad ng isang ibon ang tiyanak.” | Replaced `[kulang ang scan]` with the verified wording. |
| `even-067` | 26 | Blank page before the **Mga Halímaw** title page on page 27. | Recorded as `[blangkong pahina]`. |
| `even-056` | 46 | Blank page before the **Mga Aswáng** title page on page 47. | Recorded as `[blangkong pahina]`. |
| `even-049` | 60 | Blank page before the **Mga Bayáni** title page on page 61. | Recorded as `[blangkong pahina]`. |
| `even-038` | 82 | Blank page before the **Mga Aníto** title page on page 83. | Recorded as `[blangkong pahina]`. |
| `even-031` | 96 | Blank page before the **Mga Diwatà** title page on page 97. | Recorded as `[blangkong pahina]`. |
| `even-024` | 110 | Blank page before the **Mga Bathalà** title page on page 111. | Recorded as `[blangkong pahina]`. |

## Suspected poor or unusable captures

These scans visibly suffer from extreme darkness, bleed-through, washout, or
very faint reproduction. Some may be blank pages or illustrated versos rather
than missing text. They should be checked against the physical book before
being discarded.

| Source scan | Printed page | Observed problem | Review status |
| --- | ---: | --- | --- |
| `even-008` | Unknown | Extremely dark; content cannot be identified reliably. | Needs manuscript comparison |
| `even-009` | Unknown | Extremely dark; likely a repeated capture of the preceding page. | Needs manuscript comparison |
| `even-010` | Unknown | Extremely dark; likely a repeated capture. | Needs manuscript comparison |
| `even-012` | Unknown | Dark bleed-through obscures the page. | Needs manuscript comparison |
| `even-014` | Unknown | Dark bleed-through obscures the page. | Needs manuscript comparison |
| `even-076` | Unknown | Very faint reverse or bleed-through image; content uncertain. | Needs manuscript comparison |
| `even-078` | Unknown | Extremely dark; content cannot be identified reliably. | Needs manuscript comparison |
| `even-080` | Unknown | Contains a visible scanning-application artifact over the page. | Needs a clean rescan if the underlying page contains book text |

## Repeated captures

Repeated captures are not necessarily corrupt, but they can cause accidental
pagination errors. The following adjacent scans appear identical or nearly
identical in the contact-sheet review:

- Odd batch: `odd-013`/`odd-014`, `odd-021`/`odd-022`,
  `odd-040`-`odd-042`, `odd-051`/`odd-052`, `odd-054`-`odd-056`,
  `odd-057`-`odd-059`, `odd-063`-`odd-066`, `odd-072`/`odd-073`,
  `odd-074`/`odd-075`, `odd-076`/`odd-077`, `odd-078`/`odd-079`,
  `odd-083`-`odd-085`, and `odd-092`/`odd-093`.
- Even batch: `even-002`-`even-004`, `even-008`-`even-010`, and
  `even-062`/`even-063`.

These groups remain provisional until their printed page numbers and text are
compared at full resolution.

## Review procedure

When a physical page is checked:

1. Record whether the source scan is complete and legible.
2. Add or confirm its printed page number.
3. If a replacement scan is made, retain the original source ID in the notes.
4. Update this register and `metadata/page-map.csv`.
5. Replace `[kulang ang scan]` only after the missing wording has been verified
   directly from the book.
