# Pure UI: a screen as a function of state

Based on Guillermo Rauch's article "Pure UI" (rauchg.com/2015/pure-ui). For interfaces with data: a screen, component, web app, dashboard, form. Not needed for a format mockup (post, poster, banner).

## The point
A screen is a pure function of data: `view(params) → markup`. The same parameters give the same look. The designer does not draw transitions "how to get from A to B", they draw each state separately: what A looks like and what B looks like. An artboard is a call of the function with parameters: the mobile version is `view({ width: 375 })`, a disabled button is `button({ disabled: true })`.

## How you work
1. **Parameters before the mockup.** List the screen's inputs: data (a heading, a number, an image, a list), status (no data, loading, error, done, partial), user (role, permissions, first time), environment (width, theme, long locale). In one line in the answer: "states: …".
2. **The state map.** Each meaningful combination is an artboard with a caption "what input". The basics first: empty, loading, error, normal; then the edges — long text, zero and a huge number, one row and a hundred, a light and a dark image, the container edge, an image that did not load. You do not draw all combinations: only those that change the look.
3. **One code for all states.** Write the component as a function of parameters, build the map from a list of parameters per the `templates/states.html` template, not with copies of files: an edit of the component is seen at once in all states.
4. **Data, not lorem.** Real texts, names, numbers and images from the task or a source; if there are none — a placeholder in square brackets. Lorem ipsum hides that the look breaks at a real length.
5. **Discovery of states.** Push the parameters beyond the breakpoints: width 320…1600, long strings, empty fields, bright and light images (the "Chaos" button in the template). If something broke, it is a new state: add it to the list and draw it (the hint at the edge splits in half, the progress bar's shadow on a light frame).
6. **A new state is a new parameter.** The owner or a developer named a case ("what if the network drops?") — it is a line `{ stalled: true }` in the list and an artboard on the map, not a separate mockup and not a verbal "we'll take it into account".
7. **Completeness by number.** You hand in "states N, drawn M": if 10 of the 20 named are ready, the work is half done. A map that grew along the way is a signal that the task was wider than it seemed: tell the owner in one line.

## Check before showing
- There is a line "states: …" and a map where each one is captioned with its own input.
- Empty, loading, error and at least two edges (long text, extreme width) are drawn.
- Not a single lorem ipsum; numbers and names from the task or in square brackets.
- "Chaos" has been run; the breakages found are fixed or added to the map.
- The answer has "states N, drawn M".
