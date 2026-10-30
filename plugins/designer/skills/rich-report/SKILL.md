---
name: rich-report
description: Laying out a report for the owner as one Telegram rich message and an .md file in the hub chat: block order, pictures, collages, slideshows, tables, collapsible blocks, rhythm on a phone. Use when asked to lay out a report, recap, analysis, a selection with pictures for Telegram, "send it as a rich message", or to "go through the report for clarity".
---

# Rich report

A report is one `.md` file with pictures on disk. It is sent with `hub send-rich <file.md>` (an optional hub extension, not a core command; without it the author sends the `.md` as a file): the `.md` itself goes to the hub chat, and a rich message to Telegram. A cloud link instead of a file, an HTML page, base64 pictures are not allowed. It is read on a phone, on the go.

## Who does what
- The text is the writer's (their skill `report-copy`); you do not change the meaning, numbers and wording: only the order, the split into blocks, pictures, tables, collapsibles. If a word jars, return it to the writer in a line.
- Whoever the report belongs to sends it. If the task came with `--for-session <author>` (usually from the writer), the result of the turn with the full path to the `.md` goes to the author by itself; you do not write to the writer and do not run `send-rich` yourself.

## Syntax (Telegram Bot API, Rich Markdown)
- `#`–`###` headings, paragraphs, `**bold**`, `==highlight==`, lists `-` and `1.`, a quote `>`, `---`, a footnote `text[^1]` + a line `[^1]: …`.
- A picture is a separate block on its own line: `![](/full/path/img/hit.jpg "caption")`. Pictures cannot be inside a paragraph, a list or a table cell.
- A collage and a slideshow are a tag, a blank line, pictures one per line, a blank line, the closing tag:
  ```
  <tg-collage>

  ![](/…/a.jpg "Post A — 106 likes")
  ![](/…/b.jpg "Post B — 70 in 6 hours")

  </tg-collage>
  ```
  `<tg-slideshow>` works the same way.
- A collapsible: `<details><summary>How we counted</summary>`, a blank line, markdown, a blank line, `</details>`. `<details open>` is open at once.
- A table is GFM; cells hold only text and inline markup (`**`, `==`, a link).
- Limits: 32,768 characters, 500 blocks (a table row and a list item are blocks too), 50 pictures, 20 columns.

## Order
1. The first line is the essence from the writer (what happened, the main number, what is needed from the owner). The `#` heading goes above it, short: "Weekly report, 17–23 October".
2. Right after it the main picture: one, large, with the caption "what it is — number".
3. Numbers: a table "metric | now | was", 3–6 rows. The most important number in bold.
4. Sections `##` by importance for the owner: what came out → what is wrong → what to do. In a section: 1–2 lines of conclusion, then the proof: a picture, a quote, numbers.
5. The method, sources, caveats, "what is unknown", long tables and lists go in `<details>` at the end, closed.
6. "Need from you: …" is the last line, if there is one.

## Pictures
- A picture goes under the paragraph that is about it, not as a gallery at the end.
- One main picture is a single block. 2–4 of one kind (neighboring posts, variants) make a collage. 5+ or a sequence (before/after, steps, rounds) make a slideshow.
- Each has a caption: what is on it and the main number. No "Fig. 1", no file name.
- If there is no picture that adds meaning, go without; do not paste a screenshot of a table or a logo for the sake of a picture.
- Paths are full. Pictures already on disk (screenshots, frames): link to them as they are. If you prepare your own (a crop, compression), put them in `img/` next to the report, jpg up to 1280 px on the long side (`sips -Z 1280` or ffmpeg).

## Tables
- On a phone 2–4 columns read well. Wider: split into two or turn into a list.
- A table is for comparison (now/was, groups). One object with five fields is not a table: a picture with a caption and a line of numbers.
- Long text in a cell is a sign it is not a table.
- Numbers to the right (`---:`), digit groups with a space.

## Rhythm
- Alternate: text — a picture or a table — text. Not two tables in a row, not more than ~6 lines of text with no hook (a picture, a bold number, a heading).
- A paragraph is up to 3 phone lines (~250 characters). A list is up to 5 items, the rest in `<details>`.
- `---` only between large parts.

## Check before handing over
- From the headings and the first line it is clear what happened and what is needed from the owner.
- Every picture: the file exists (`ls`), has a caption, stands by its text.
- Tables up to 4 columns, no text in a cell longer than a line, limits respected.
- Nothing service-related: no paths and file names in the text, scripts, session names, "the page next to it".
- The meaning and numbers match the writer's text.
