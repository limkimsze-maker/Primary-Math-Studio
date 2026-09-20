# Primary Maths Studio — Luna handoff

## Goal

Continue this project in a fresh Luna conversation from its GitHub source. Keep the existing P1–P3 Singapore Mathematics engines, teacher/pupil views, guides, responsive layout, and bottom credit.

## Important unresolved item: Money

The present Money addition and subtraction implementation is **not approved**. It was reconstructed from requirements and does not yet reproduce the teaching sequence of the two original interactives closely enough.

Use the original GitHub source—not an inferred generic algorithm—as the authority:

- Addition: https://limkimsze-maker.github.io/P1_to_P3_Adding_Money/
- Subtraction: https://limkimsze-maker.github.io/P1_to_P3_Subtracting_Money/

Read their repositories and reproduce, step by step:

1. the order in which each place is handled;
2. what appears before and after each pupil/teacher action;
3. the regrouping or renaming animation and written working;
4. the dollar sign and decimal point separating dollars and cents;
5. the simple, copyright-safe drawings of the notes and coins; and
6. the exact addition and subtraction teaching flow used in the originals.

Do not treat the current five-column `$100 / $10 / $1 / 10¢ / 5¢` implementation or its test as proof of fidelity. Replace that structure wherever it differs from the original interactives.

## Acceptance rule

Create sequence-level tests based on the original source. A test must verify every revealed state in order, including carries/renaming and the written algorithm—not merely the presence of columns, tokens, or CSS classes. Check both a normal example and an example requiring regrouping across zero.

Do not publish the Money update as complete until its step sequence and graphics have been compared directly with both original interactives.

## Current source state

- Last completed code commit before this handoff: `ef1dbe1d11b8c0f30224e91d143a0631343a4cc1`
- Existing Sites URL: https://primary-maths-engines.lim-kim-sze.chatgpt.site
- The existing live URL has not received the latest local update.
