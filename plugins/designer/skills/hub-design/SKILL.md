---
name: hub-design
description: The designer's work on the Hub Design canvas. Use when a Hub Design message arrives: "Edits to the design … (Hub Design, round N…)", "New design (Hub Design): …", the presets "new presentation|design|design in the project code|design system|animation: …", or when the owner writes from the Hub Design chat panel.
---

# Hub Design

Hub Design is the hub canvas: it opens your HTML mockup, the owner moves elements, comments, draws on top and sends you a batch of edits. You have no canvas tools: you edit the file yourself, and the canvas finds it by the full path in your answer.

## Mockup file
- Where it lives: one task, one folder, with all its variants and rounds. A path in the assignment (the line "All the designs of this task go into one folder…" or "Save into the direction folder…") is taken as is. With no such line, a task from a direction goes to `<direction folder>/design/<task>/`. You recognize a direction like this: "Task from session <name>" or `--for-session <name>` and the name is in `hub direction list` → it is a direction, and its folder comes from there; earlier packs of the same direction in the working folder are not a precedent; otherwise → `<working folder>/<task>/` (no second `design/`). `<task>` is a short Latin slug of the substance: `poster-bf`, `stories-kyoto`, `ad-banner`. Not the root of the working folder, not mixed in with the project brief.
- Task start: as the first step create its folder and write its full path into `hub task note`; each variant and round is a subfolder `<task folder>/<mockup-name>-1a/index.html`, assets in its `assets/`. After handing over (`send-file` has gone), `ls` the task folder and the working folder: if a file of this task landed outside it (the root, a project folder, `/tmp`), move it into the task folder and name the new paths in the answer.
- Mockups by task (Hub Design): the assignment has the line "All the designs of this task go into one folder: `<path>`<design-name>/ …", and it outranks the line above and your own working folder. Each mockup of the task is a subfolder `<path>/<mockup-name>/` with `index.html`, assets next to it (`assets/`); a new variant or round gets its own subfolder there, the copies `.r<n>` go next to the `index.html` of their subfolder. You do not put the task's mockups outside this folder; `send-file` takes the full path to `index.html`.
- A round or an edit with no task line in the message goes to the folder where the first version of this mockup lies (next to it), not to your working folder and not to a new one.
- The `<title>` of a mockup is its caption in Hub Design: "<Kind> <number>, <substance>". The kind is one word from email, post, story, banner, landing, slides, poster, ad, screen; the substance is 1–3 words, the main heading of the mockup; no round number and no variant letter. Examples: "Email 1, Kyoto", "Post 01, 50% off". Without such a `<title>` the caption comes out faceless ("Design-1: offer").
- The mockup name is meaningful, in Latin letters, always relevant: kind and substance, `email-kyoto`, `banner-bf-50off`, `landing-pricing`; variants and rounds as a suffix `-1a`, `-2a`. Not `index`, `mockup`, `design`, `test`, `v1`, `new`, `final` as a mockup name; `index.html` only inside a folder with such a meaningful name by the task line above.
- One mockup, one `.html` in its own folder, assets (fonts, pictures, video) next to it in `assets/`; paths in Latin letters only. No network where possible: fonts and icons local.
- The canvas window is 1440×900, but edits may come with a 1440×8000 window. The page height comes from the content, not `100vh`; cap heights based on vh/svh from above (`clamp(…, 920px)`), otherwise the hero spreads apart.
- An `id` on every meaningful block (`hero`, `pricing`, `cta`, `card-1`…), the same ones when you re-lay out: the canvas pin catches the id first, and without it an edit of the next round loses the element.
- Properties the owner will turn in the canvas panel on a specific element go in an inline `style` on it: the panel writes into `el.style`. Layout is flex/grid with `gap`, columns only `repeat(N, minmax(0,1fr))`.
- The mockup's tweaks are 2–3 meaningful levers: style, font, composition, a block variant, theme or density. Not the size of one element, not texts and not a color that stands in one place. You declare them in `<head>` and the canvas panel shows them:
  `<script type="application/json" id="hub-tweaks">{"style":{"editor":"enum","default":"stack","options":["stack","center","plate"],"attr":"data-style"},"font":{"editor":"enum","options":["display","grotesk"],"attr":"data-font"}}</script>`
  Types `text|color|int|float|range|boolean|enum`, fields `options`, `min/max/step/unit`, `section`. `var` is a CSS variable in `:root` (in CSS you write `var(--accent)`, the default value lives in `:root`), `attr` is an attribute on `<html>` (in CSS `[data-density=compact] …`). For a color, only swatches in `options`, 3–4.
- If a picture or video does not exist yet, use a slot from the `image-slot.html` template: the size is held by `aspect-ratio`, the caption is the id, what is in the frame, the size and format, the path `assets/<id>.<ext>`; when the file appears, the slot shows it by itself. A gray placeholder does not go into the final; in a template for sale, if there is no asset or it does not fit, the final has an empty place for it and the composition holds.
- Video: `muted playsinline loop autoplay`, the hevc source first, webm second, a poster. If the subject makes sound (a social card, a clip with sound), sound is needed: no `muted`, with `controls`, hand over an mp4 with sound.
- Animations: appearing on scroll (IntersectionObserver) with a fallback timer, `prefers-reduced-motion`, curves in variables.
- Accessibility basics: `:focus-visible`, `aria-label` on icon buttons, text contrast.

## Templates
They live next to the skill, in `templates/`. Copy the one you need into the mockup folder and fill it in; change the general look and colors to fit the project, do not break the structure of the template.
- `phone.html` — a 390×844 phone frame (class `android` — the Android variant): a mobile screen, an app. Several screens — frames in a row, 80 px apart, each with an `id` and `data-screen-label` "NN Name".
- `browser.html` — a 1280–1440 browser window: a landing or web app, when it matters to show it as a site.
- `slides.html` — a presentation: 1920×1080 slides fitted to the window, paging by arrows and by a click on the edge, the number "N / total", the slide in the address (`#3`), printing one slide per sheet.
- `image-slot.html` — a place for an image (see "Mockup file").
- `states.html` — a map of interface states (Pure UI): the component as a function `view(p)`, a list of inputs `STATES`, each one an artboard with a caption; `?state=<id>` — one state full screen, the "Chaos" button breaks the parameters.
The screen caption (`data-screen-label`) — on every screen and slide, with a two-digit number: "slide 5" is `05`.

## Mockup in a format
A post, a story, a poster, a template for a design service: a document exactly the size of the medium, with no margin around it, plus `<meta name="hub-frame" content="1080x1350">`: the canvas takes the frame and the PDF from it. One file, one mockup. Fonts only those that exist where the mockup will be built (for a design service, from its library). Nothing service-related on top of the mockup: no overlays, debug captions, grid.
- Markup for the check: the heading is `id="headline"`, the illustration is `<img data-ill-style="<style from the MCP>">`; a large figure without a picture (a circle, a sign, a plate-image) is `data-ill="shape"`, otherwise the check counts its place as empty.
- The illustration style is chosen before assembly: by the direction's style file ("Use" and "Avoid"), if it exists, otherwise by your own `CLAUDE.md`. One illustration, one mockup of the pack.
- The palette comes from the pixels of the illustration: `scripts/precheck.js` prints its colors by share, the opaque part only. The background is in the illustration's tone but distinguishable from its details. A semi-transparent illustration (glass, watercolor) you check on the snapshot: how it lies on the background.
- Fonts come from the direction's samples: the illustration style → a pair that has already passed. If there is no pair for the style, 2–3 options, not one guess.
- A mockup from a reference: before assembly a line in the task note, in percent of the frame: "keep" (grid, the hero's share, overlap, heading size), "adapt", "replace" (color and font come from the illustration, not from the reference).

## Design rules
From the owner's edits; they apply to any mockup, not only from the canvas.
1. Balance is optical, not by margins: compare the emptiness left and right, top and bottom by the weight of objects.
2. The size of an object and the margins come from the neighbors and the frame; edits go both ways ("smaller", "move apart", "take it past the edge").
3. Related things closer, unrelated further: a caption next to its arrow, neighboring logos moved apart.
4. An element that explains nothing is removed (an arrow with no caption).
5. An asset with no blur and no artifacts; generate only if it was ordered.
6. A series does not repeat: each frame has its own color, composition and technique; the post, story and poster of one pack have different visuals.
7. A template pack for sale: assets are ours, fresh, on topic; illustrations are detailed and rich, based on what sells; boring ones, even popular, are not taken. Bright, modern, on trend. Minimum text: a heading, a subheading, a little more. Each mockup of the pack goes to approval separately (section "Approval").
8. A document or recap is for a person: the heading, the essence, from whom, how long it has been waiting; a recap is detailed, with pictures of the hits and an analysis of the comments.

## Craft
Thresholds literally: text contrast 4.5:1, large text (from 24 px or from 19 px bold) 3:1, icons and control borders 3:1; a tap target from 44×44 px; text on a 1920×1080 slide from 24 px; for print from 12 pt. Gray captions and fills under white text usually fail: darken. The rest is already in the kit, I do not repeat it here: the signs of AI (Inter, Fraunces, gradients, a stripe on the left of a card, emoji) are `impeccable`; real `<button>`/`<a>`/`<label>` even in a static mockup are `ux-check`; telling colors apart by lightness is `better-colors`; not inventing facts is `ux-writing`. For the canvas only:
- The owner's explicit words and the colors of their design system outrank the contrast thresholds.
- If there is no number or fact, a placeholder in square brackets (`[PRICE]`), not a plausible number. Do not set a placeholder at the biggest size (the hero number of a cell, a hero): there you build the idea without a number ("All day and night") or ask for the number. No fake status bar, no "live" counters and no lorem ipsum.
- The page works at phone width: the menu collapses, toolbars wrap, a wide table scrolls in its own frame.

## New mockup
- "New mockup (Hub Design): <words>" — treat as a new screen per your CLAUDE.md, questions per the rule below; then 2–3 directions as a round: each a separate file side by side, `<name>-1a.html`, `-1b.html`, `-1c.html`; the next round — `-2a`, `-2b` (from the chosen one or per new words). Earlier rounds are untouched, in the answer you name them by file name; on the mockup itself — a small badge `1a` in the corner (except a format mockup: there is no badge there, the variant is in the file name), explanations go in the answer. One mockup with knobs instead of a round — when the variants differ by one or two levers.
- Questions before a new mockup: one form, up to 3 questions. One of them always, if the brief did not answer it itself: "Design system: the project's own or a universal style?" — options "The project's own", "<a style from the brief, e.g. clean Swiss>", "another system or brand". The rest — only open forks (what about, format, what is the main thing), the question rests on what was read from the owner ("there are four topics in the notes — which one in the hero?"), each with 2–4 concrete options, the recommended one first, no "at your discretion". A full brief or a small edit — no form. A second round — only if the answer opened a new question.
- The frame's system — before the first line of the mockup, in one line in the answer ("system: Inter Tight, 5 styles 318/76/30/17/16, 12 columns, margin 56, paper + black + red"): 1–2 fonts, up to 5 text styles (size + weight) for the whole mockup or series, a column grid and margins, 1–2 backgrounds and one accent. Then every text is one of these styles, every block starts on a grid column or on a common axis with its neighbor; you do not introduce a new style or axis "by eye". Spacing — per the rule of inner and outer (CLAUDE.md, item 6).
- Style. The last line of the message "Style reference: <path to .md>" (the "Style" button on the canvas) — read that DESIGN.md in full and build the mockup on its tokens as they are: colors with roles, fonts, type scale, spacing, radii, shadows — without translating them into your own radius scale, your own color families and your own spacing. The owner chose the style — its tokens outrank your defaults and the AI tells from `impeccable` (Inter at Linear stays Inter), and the owner's explicit words outrank the style. The style is a source of tokens, not a copy of the site: you do not carry over the brand's logo, texts and images. In the answer, one line: "style: <name>".
- A style in words ("like Linear", "in the style of Stripe", "dark SaaS", "Swiss", "bento"), without a Style reference line — first the style's section in `references/styles.md` of this skill (rules and clichés), then look in the style library: the folder `$HUB_DESIGN_STYLES`, otherwise `styles_dir` of the hub-design extension in `hub.json`, otherwise the path from your CLAUDE.md. In it is `index.json` (uuid → name, category, tags, description, file): a brand — by `name`, a general description — by `category`, `tags`, `description`; 1–3 candidates. One — build on it; two or three — the round's directions, each on its own style, in the answer which is where. If there is no library — work without it and do not say so. You only read the library files: you do not copy them into repos, packages or anything public.
- An interface with data (a screen, component, web app, dashboard, form) — per `references/pure-ui.md`: before the mockup a line "states: …" (the screen's inputs), the component as a function of parameters, a state map per `templates/states.html` (empty, loading, error, normal, edges), real data instead of lorem, a new state is a line in the list, not a new mockup; in the answer "states N, drawn M". Not needed for a format mockup.
- Presets:
  - **presentation** — from the `slides.html` template: one idea per slide, large text, little of it.
  - **design** — a page or screen in HTML/CSS; mobile — in `phone.html`, a site for showing — in `browser.html`.
  - **design in code** — in the project's repo, in its stack and components; to the canvas — the path to a page that can be opened as a file or with a local server.
  - **design system** — `tokens.json` (color in OKLCH, typography, spacing, radii, shadows, motion) + `DESIGN.md` (rules of use, components) + `index.html` with all samples on one page.
  - **animation** — not yours: `hub send animator` with the owner's words.

## A batch of edits
On a hub in another language the same labels come in that language, and you parse them the same way. The English labels: "Edits to the design", "Comment on", "no id, hints: tag …, text …, inside #…, classes …", "element not found — the design was relaid out", ", already in the file" (or " — already in the file"), "Edited by hand", "Freehand drawing: arrow / circled area / framed area … near", "Tweak `key`: a → b", "grid columns 3 → 4", "Errors in the design (N)", "and K more", "Selected:", "Grid over the frame", "Canvas note", "Notes from the Hub Design canvas". You answer in the owner's language.

What arrives is "Edits to the design `<path>` (Hub Design, round N; …)" and numbered items:
- "Comment on `<selector>` "text", point x,y: …": you edit only this element and what depends on it. "No id, hints: tag …, text "…", inside #…, classes …": you look for the element by the hints, not by the selector, and give it an id. "Element not found — the design was relaid out": you look by the meaning of the comment and the point; if unsure, ask a question on this item.
- "Comment on the area x …, y …, W×H px (inside #… "…"; in it: #id "text", …): …": you edit the elements that fell into the frame and do not touch the rest.
- An item marked ", already in the file" (earlier " — already in the file"; a manual edit or a tweak) has already been written into the mockup by the canvas itself: the inline style or the text of the element, the tweaks on `<html>`. You do not repeat it. The look on screen is right and you keep it; you may replace the inline style with ordinary layout only if the look does not change.
- "Edited by hand `<selector>`: move/size/text/style was → became" with no mark: you carry it into the layout so that it comes out the same: spacing, widths, flex/grid, not a `transform` on top.
- The line "Keep the owner's manual positions as is": whatever the owner moved or changed by hand stays exactly there when you carry it into code: you do not roll back, do not align to the grid or the neighbors, do not "fix" spacing and asymmetry. If it seems broken, ask in one line in the answer, do not edit.
- "Freehand drawing: arrow / circled area / framed area … near `<selector>` (<caption>)": you read it as a pointer to a place; if it is unclear what it means, a question in the answer on this item, and you do the rest.
- "Tweak `key`: a → b" with no mark: the owner picked a value in the panel: you make b the default value (`default` in `hub-tweaks` and in `:root` or on `<html>`), so that it opens this way without the panel.
- The canvas's built-in tweaks "Margins", "Font size", "Letter spacing", "Line spacing" are not written into the file, they arrive in words: you put the value into the mockup's CSS yourself.
- An automatic message that ends with a line saying these are the owner's own actions in the Hub Design panel, sent by themselves, no report needed, answer with one line "—": you make the change that is required, and the result of the turn is one line "—". A manual send without this mark gets an answer as usual.
- A style edit like "grid columns 3 → 4 (grid-template-columns: … → …)" or a change of `display` to flex/grid: you carry it into the block's CSS in the same form, `repeat(N, minmax(0,1fr))`.
- "Errors in the design (N): • text (file:line) … • and K more": you fix the cause of each; if you did not find one, you write about it in the answer for that line.
- "Selected: <file> `<selector>` <tag> "<caption>"" at the end is the element the words are about when there is no pin ("make this block wider").
- "Grid over the frame (a layout guide…)": only a guide: you align the layout to it, you do not carry the grid itself into the mockup.
- Sticky notes are context, not separate edits, unless said otherwise.

Order: as the first step, before any edit, save a copy next to the file under the first free name `<name>.r<n>.html` (n one more than the largest that exists). You do not overwrite or delete other `.r*` files, including the canvas copy named in the message. Work pointwise: read the file, change what is needed, do not rebuild the whole page. "Put it back as it was" means a rollback from the copy, with no side edits.

## PDF
The owner downloads the PDF of a mockup with the "Download PDF" button on the canvas. If asked for a PDF, you remind about the button; for a presentation, printing goes one slide per sheet (the `slides.html` template does this).

## Check before showing
A new mockup, pack or rework does not go to the owner until it has passed this:
1. A snapshot at the frame size (a format mockup) or 1440×900 and mobile 390 (a page). You check the grid with a separate snapshot over it; it does not go into the mockup.
   A format mockup — by number: `node <skill folder>/scripts/precheck.js [--pack] [--styles <styles file>] <index.html…>`. The script takes a snapshot into `shots/` and puts `<name>.check.json` next to it. A pack — one run with `--pack`. Exit code 1 — there is a STOP.
   - STOP — do not show until fixed:
     - the biggest thing is not the heading or the illustration;
     - text at the edge: closer than 32 px at the side, closer than 20 px at the top or bottom, in a story outside 220 px at the top and 250 px at the bottom;
     - an empty strip across the whole width taller than 16% of the height;
     - an illustration smaller than 7% of the frame;
     - a style from "Do not use" or, with `--styles`, an illustration without `data-ill-style`;
     - one illustration twice in a pack;
     - a pair falls apart: the gap to the neighboring block is smaller than the gap between the block's lines (a three-line subheading with wide leading sits closer to the heading than the lines to each other).
   - WARN — a hint, you decide:
     - more than 2 fonts or 4 sizes;
     - text with more mass than the heading;
     - a margin smaller than 56 px at the side and 48 px at the top or bottom;
     - an empty area larger than 16% of the frame;
     - a third of the illustration the color of the background;
     - a muddy background (mid-lightness gray);
     - a background, font pair or style more than 2 times in a pack;
     - a weak pair: the gap to the neighboring block is less than 1.5 times larger than between the lines;
     - equal spacing: different text styles in a row with the same gap, the groups do not read.
   - The numbers catch only the coarse: "a bigger heading", "there is room", "the colors are wrong" the script does not see, that is item 5.
2. A check against the "Design rules" and "Format mockup": for each item "yes", "no" or "not about this mockup". If there is a "no" — fix it and shoot again.
3. The "Owner's taste" from `CLAUDE.md` — by six aspects (composition, typography, graphics and illustrations, colors, angles, balance): if a line is violated — fix it.
3a. An interface with data — the `references/pure-ui.md` check ("Check before showing"): the map is captioned with inputs, empty/loading/error and two edges are drawn, "Chaos" has been run, "states N, drawn M".
4. A series — a board of all frames side by side: look for pairs similar in color or composition.
5. Balance, "interesting" and "trendy" you do not judge yourself.
   - If the direction has a reviewer, a session that accepts mockups before the owner, the mockup goes to it first. Give it the snapshot, `check.json` and 3–5 samples closest to the mockup: the same format (post, story, poster), then the same illustration style, then the same offer type; among them at least one accepted and one returned with a reason. Ask with two separate questions: "what is wrong here next to the samples" and then "where exactly and what edit". If it returned with specifics — fix it, then again through item 1. To the owner goes only what the reviewer let through.
   - If there is no reviewer — `hub critic <board> --task "<what mockup this is>" --evidence <snapshots and samples>` looks for what to reject it for; what holds up — you fix.
   - To both the reviewer and the critic — also a "yes/no" by the snapshot only, without code: the main thing is visible in a second; squinting, 2–3 masses, not a mush; with the logo covered it is not a competitor's mockup; no accidental voids; all text is legible. A "no" — you fix it; no more than 3 rounds of edits, you show the best, not the last.
   - Samples — the `samples/` folder in the direction's design folder: `approved/`, `rejected/` and `README.md` (style, fonts, the owner's words). Got a ❤️ — the snapshot goes to `approved/` and a line to the table. Got a 👎 with a reason — to `rejected/` with their words.
6. In the answer — the check lines where there was a "no", with what was fixed; the board — as a path in the answer, it does not go for approval. A batch of edits — check each item against the snapshot.

## Before answering
- A small edit (text, color, one element): only what was named, no snapshots: the owner sees the result on the canvas.
- If you did not open it in a browser or are unsure of the cause, say so, do not invent.

## Answer
- The first line — what was done (up to 12 words). Then by the batch's numbers: "1 — done", "3 — question: …". The last line — the full path to the `.html`: the canvas finds the mockup by it, so the path is mandatory here, even if the rules for the result say "no paths".
- A new mockup with variants — the full path of each file, one per line; how the variants differ goes in the answer, not in captions on the mockup.
- A finished mockup (`.html`, `.pdf`, `.md`) — new, a variant or a rework — is delivered to the chat as a card, as in Claude Design: `hub send-file <full path>` as soon as it is ready (a UI with its own texts — after the writer's edits, CLAUDE.md "UI texts"), and only then take on the next one; a batch at the end of the turn is not allowed; the feed draws an "Open in Hub Design" card from it. An answer to a batch of edits from the canvas — without `send-file`: the owner is already in the mockup. A task from another session — no `send-file`: full paths to it in the result, it sends to the owner.

## Approval
Any design for approval (a mockup, a variant, a pack, a rework after an assessment) on your own task goes as a separate `hub send-file <full path>` for each mockup right when it is ready, not a grid, not a board as one file and not a batch at the end of the turn. If the hub has Telegram with mockup posts (Hub Design, `telegram.design_posts`), it reaches the owner as a post: a snapshot of the first screen, the name, ❤️/👎; if not, as a card in the chat, the call is the same. Replies come to you as messages:
- "hub-design: the owner gave your design "…" (path) a ❤️ in Telegram: liked it": the variant is accepted: you hold this direction and do not develop the other variants of the round until told.
- "… a 👎 …: disliked it…": wait for the reasons in the next message "why the owner disliked your design "…" (path): what did not work: <aspects>; in the owner's words: <words>. <assignment> Feedback record: …". The aspects are the owner's checkmarks: composition (positions, layout), typography, graphics and illustrations, colors, corners (rounding), balance; there may be only "in the owner's words":
  - not all are marked (or only words): "Redo only these aspects / this": in this same mockup you edit only what was named and do not touch the rest: a copy `.r<n>` as the first step, the edit, the same mockup `hub send-file` again (it reaches the owner as a new post);
  - "what did not work: everything" (all aspects marked): the mockup does not work as a whole: a new variant (a new round file), not a patch of this one, you take the owner's words into account, and `send-file`.
- Each line `Feedback record: design=<path>; verdict=dislike; reasons=<composition|type|illustration|colors|angles|balance, comma-separated, or words>; words="<words>"` is a lesson, in the same turn, before editing the mockup:
  1. A line in the log `owner-feedback.md` in the root of your working folder: the date, the mockup (name and format: post, landing, screen), reasons, the words verbatim, and after "→" one phrase on what exactly in the mockup was wrong for each aspect (you look at the mockup, do not guess).
  2. The conclusion goes into the "The owner's taste" section of your `CLAUDE.md` (inside the `specialists:local` marks), as a line under the aspect: "Colors: does not work … (N times, last DD.MM: "words"); works …". The owner's words are a rule at once; a bare checkmark with no words becomes a rule at the second time for the same aspect on a similar mockup, the first time only the log. If the new one contradicts the old, edit the old line, do not pile them up side by side.
  3. A ❤️ after a rework goes to the aspect's line "works: …" (what you changed, and it was accepted).
- Before a new mockup, read the "The owner's taste" section (and item 3 of "Check before showing"). In the answer a line "taste: <which lines you took into account>".
- "the owner replied in Telegram to your design "…" (path): <text>" is an edit to this mockup, like an item of a batch: a copy `.r<n>` as the first step, you edit, `send-file` again.
A pack or mockup is delivered only after a ❤️ from the owner on each one; without them it is "awaiting approval", not "delivered".
- A pack (several mockups of one task): the owner's words or a 👎 with a reason on one mockup of the pack ("redo everything", new inputs for the task) apply to the whole pack. At once: you do not send the old variants not yet sent, you stop `send-file` of old ones, you redo the whole pack by the new inputs as a new round and send one by one when ready. You send no interim statuses ("working", "3 left") to the owner. If it is unclear whether it is about the whole pack or one mockup, one form, and until it is answered you send no old ones.
  The Hub Design line "This applies to the whole batch of N designs you sent together: …" is the same rule, unambiguous: it may arrive in the middle of your turn, and you drop finishing and sending the old ones at once; the new variants of all mockups on the list go into the task folder from this line, each in its own folder `<mockup-name>-<round>/index.html` with `assets/` inside, and each gets `send-file`.
