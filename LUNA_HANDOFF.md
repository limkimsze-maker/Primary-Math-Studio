# Primary Maths Studio — Luna handoff

## Goal

Continue this project in a fresh Luna conversation from its GitHub source. Keep the existing P1–P3 Singapore Mathematics engines, teacher/pupil views, guides, responsive layout, and bottom credit.

## Money addition and subtraction completed

The Money addition and subtraction implementation has now been rebuilt directly from the two original interactives:

Use the original GitHub source—not an inferred generic algorithm—as the authority:

- Addition: https://limkimsze-maker.github.io/P1_to_P3_Adding_Money/
- Subtraction: https://limkimsze-maker.github.io/P1_to_P3_Subtracting_Money/

The completed implementation reproduces, step by step:

1. the order in which each place is handled;
2. what appears before and after each pupil/teacher action;
3. the regrouping or renaming animation and written working;
4. the dollar sign and decimal point separating dollars and cents;
5. the simple, copyright-safe drawings of the notes and coins; and
6. the exact addition and subtraction teaching flow used in the originals.

Addition moves the lower-row tokens into the upper row, visually groups exchanged tokens, creates the carried token in the adjacent column and reveals the matching written digit. Subtraction keeps one working row, shows every adjacent borrow separately, crosses out the donor and the removed tokens, and updates the crossed-out/renamed written digits before revealing the result digit.

`checks/check-money-operations.mjs` verifies every state for `$12.75 + $8.60`, `$31.60 − $20.90`, borrowing across zero in `$20.50 − $1.60`, and the special `10¢ → two 5¢` exchange. It also checks the dollar sign, decimal point, question marks, carries, crossed digits and transition markers.

## Current source state

- Last completed code commit before this handoff: `ef1dbe1d11b8c0f30224e91d143a0631343a4cc1`
- Existing Sites URL: https://primary-maths-engines.lim-kim-sze.chatgpt.site
- The existing live URL has not received the latest local update.
