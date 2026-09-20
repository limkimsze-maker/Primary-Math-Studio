Release checks for Primary Maths Studio

- All 15 engine tabs opened in the managed browser preview at a 1363 × 936 desktop viewport. Main question and answer controls fitted without page scrolling.
- Checked teacher / pupil switching, workspace expansion, correct and incorrect feedback, finish / restart, place-value regrouping, fraction shading, money building, clock setting and explanation card order.
- The 12 new engines passed 141 grade/task configurations and 8,280 generated-question checks, plus arithmetic, fraction, time rollover and invalid-input cases.
- Passed 111 supported standalone HTML configurations and all 12 HTML/JSON download response checks. Special characters in teacher context text survive saving safely.
- Standalone activity copies were opened in the browser: fixed example restart preserved the question; a three-question random session completed and regenerated on restart.
- Length, mass and volume reuse their completed measurement logic with layout adjustments for the tabbed workspace. The volume five-beaker preset shows four full one-litre beakers and 250 ml in a smaller beaker.
- Grade presets checked against MOE's 2021 Primary Mathematics syllabus, updated October 2025, pp. 31–36. Original task examples are used; exact textbook pages are not reproduced or claimed.
- Native browser download capture was unavailable; file content and attachment response checks passed. Phone layouts and SLS uploads were not browser-tested. Optional WebMCP validation was unavailable because this browser did not expose document.modelContext.

Operations update

- Addition and subtraction advance from ones upwards. Multiplication regrouping and P3 up-to-3-digit algorithms are included. Division now follows Animal Rescue’s Exact Algorithm: complete the quotient/product/bring-down boxes for one place, Check Step, share discs into the group rows, exchange leftovers, then check the remainder.
- Passed 509 complete operation sequences, 2,124 teaching steps and 749 exchanges checked for value conservation, with zero, carry, borrowing across zeros and remainder cases.
- Browser pupil walkthroughs completed 1248 + 675, 1000 − 1, 348 × 4 and 326 ÷ 3, with wrong-step feedback and real internal zero handling. Desktop teacher and expanded pupil views were inspected.
- Interaction references inspected from Lim Kim Sze’s P1_to_P3_Addition, P1_to_P3_Subtraction, P3_Multiplication_up_to_3D_multiply_1D and Animal Rescue’s embedded Exact Algorithm. The division bank, group mat, colours, written working and keypad were adapted from the user’s own Animal Rescue guide.

Animal Rescue division correction

- Inspected the embedded Exact Algorithm in https://limkimsze-maker.github.io/P3-Long-Division-3D-Animal-Rescue/.
- Browser-tested a bank feeding labelled coloured discs into one H/T/O row per group, grouped quotient/product/bring-down checking, keyboard and keypad entry, and wrong/empty-step feedback.
- 326 ÷ 3 preserved the internal zero, exchanged 2 tens into 20 ones alongside the original 6, shared 8 ones per group and checked both remainder boxes. A wrong top R was rejected.
- 864 ÷ 4 exchanged its leftover tens, kept 24 ones for the last place, and completed with a bottom remainder of 0 and no top R box. Teacher: Next and hide/show mat preserved the current working.
- Checking the remainder completes the question directly; no repeated whole-answer entry is required. Completed teacher and expanded pupil algorithms fitted without internal scrolling at 1363 × 936. Smaller screens may scroll to preserve readable diagrams.

Addition and subtraction reference update

- Addition now uses two rows of individual pieces. Each Next Step combines one place, exchanges ten pieces when needed, preserves the carried annotation, and records that result digit. Subtraction uses one working row, separate adjacent-place renames, struck-through original digits, and animated crossing out before recording each difference.
- Discs and base-ten blocks use the graphics from the user's own addition activity. Switching models mid-step preserves the working and updates the builder's Model choice. Ten-thousands use discs.
- Browser walkthroughs completed 28 + 17, 999 + 1 and 1000 − 1. Wrong whole answers were rejected and could be retried. All three separate renames across zeros appeared before subtracting, and Previous step restored the earlier model and result boxes.
- Inspected desktop teacher and expanded pupil views at 1363 × 936. Removed the repeated text from the written panel and placed the previous step's explanation above the controls. The checked active and completed written panels fitted without internal scrolling; completed pupil diagrams also fitted after reducing their minimum height. Smaller screens may scroll to preserve readable diagrams.
- The teacher guide explains both sequences, links to the user's reference activities, and preserves the fixed/random activity-download explanation.

Uncle Joe multiplication reference update

- Inspected the guided panel in Lim Kim Sze's Uncle Joe and the Key of Product desktop activity. Multiplication now starts with one row of individual coloured discs per group. Each place checks the result digit and outgoing carry together, consumes an incoming carry once, and shows the pieces left after regrouping.
- Browser walkthroughs completed 348 × 4, 105 × 4 and 999 × 9. Blank and wrong carries were rejected without advancing. The internal zero in 105 × 4 stayed a multiplication step; a final carried digit had its own check. The last digit check completed the product without repeated whole-answer entry.
- Keyboard and keypad entry, Teacher: Next, Previous step, and hide/show mat were checked. Mat visibility preserved draft entries. Teacher and expanded pupil layouts were inspected at 1363 × 936; all 36 group rows in the largest checked 999 × 9 pupil example fitted without internal scrolling.
- The teacher guide explains paired digit/carry checks, automatic completion, equal-group rows and carries. Existing fixed/random download instructions and addition, subtraction and Animal Rescue division references are preserved. Rechecked 111 configured HTML exports and 12 HTML/JSON download endpoints after assembly.

Place Value Chart for Counting reference update

- Inspected Lim Kim Sze's Place-Value-Chart-for-Counting source. Adapted its coloured place columns, blocks/discs choice, separate/joined place-value cards, number words, expanded form and digit chart. Reading tasks initially hide the answer aids; revealing them counts as help. Correct answers reveal the aids, which can still be hidden again.
- Added teacher-set more/less amounts. Movement adds highlighted pieces, groups ten smaller pieces into one larger piece, splits one larger piece into ten smaller pieces, or crosses out removed pieces. Random practice preserves the chosen amount and model. Inclusive grade boundaries add the required column; 10,000 uses discs.
- Passed 578 place-value change sequences and 447 value-preserving exchanges, including zeros, arbitrary amounts, fixed-amount random practice, and inclusive limits of 100, 1,000 and 10,000. The updated suite passed 141 grade/task configurations and 8,280 generated-question checks.
- Browser walkthroughs split and regrouped 2034 without changing its cards or digit chart, rejected 2043 and accepted 2034, completed all exchanges in 1000 − 1 and 9999 + 1, and accepted 0 for the empty hundreds digit in 2034. Model switching preserved the working; Show Again restored the starting pieces and display preferences. Separate and joined cards, hiding aids after a correct answer, and the revised guide and reference link were checked.
- Inspected teacher and expanded pupil views at 1363 × 936. Cards/words and the chart sit side by side to keep the checked desktop models and answer controls visible. Smaller screens may scroll to preserve readable diagrams. Existing addition, subtraction, multiplication and division sequences are unchanged.


Hundred chart and flip chart option

- Added Hundred chart & flip chart to Place Value for all P1–P3 grade presets. It is a 0–100 exploration tool with teacher-set starting number and two teacher-set more/less amounts. The chart follows the reference orientation: 91–100 at the top and 1–10 at the bottom.
- Linked the moving counter to three working flip cards. The hundreds card is blank below 100 and shows 1 at 100; 0 appears on the flip chart outside the numbered grid. Invalid moves beyond 0 or 100 are disabled.
- More/less demonstrations move tens first, then ones. Browser walkthroughs checked 50 + 33 as 50 → 60 → 70 → 80 → 81 → 82 → 83, reversed 83 − 33, and checked the 0 and 100 boundaries.
- Passed 520 valid movement paths, including tens-first order and exact endpoints. The complete suite passed 141 grade/task configurations, 8,280 generated questions and 111 supported standalone HTML configurations.
- The teacher guide explains setup, chart direction, prediction prompts, no-score exploration, Reset and Finish/Explore again. It also explains that a downloaded copy preserves the chosen starting number and both button amounts, then resets to those settings whenever reopened.
- Teacher and expanded pupil views fitted at 1363 × 936 without page scrolling. The linked chart, flip cards, four more/less buttons and finish controls stayed visible. Existing Place Value tasks restored their normal answer entry after switching tasks.

Number Line and number-pattern reference update

- Moved the hundred-chart option to second place in the Place Value task list and renamed it “Explore numbers to 100 · Hundred chart & flip chart” so its purpose and teaching order are clear.
- Inspected Lim Kim Sze’s P3 Number Pattern activity. Jump forwards and backwards now use its linked-response idea: pupils move a blue marker and enter the same landing number. The diagram starts with a question mark instead of displaying the answer.
- Rebuilt Complete a number pattern as a nine-term number train. Teachers choose a constant or alternating pattern, positive or negative changes, and 2–4 missing terms. Pupils tap or drag coloured number cards into blank positions and can reveal or hide the rule.
- Checked the fixed alternating example 2400, 2500, 2510, 2610, 2620, 2720, 2730, 2830, 2840. Incomplete placement was rejected; all four correctly placed cards passed and revealed the rule. A forward jump from 2400 by 200 required both the marker at 2600 and the written answer 2600.
- Passed constant, decreasing and alternating pattern checks; 300 generated patterns stayed within the selected grade limit while preserving the teacher’s changes, pattern type and difficulty. The existing 141 grade/task, 8,280 generated-question, 111 download, Place Value and operation checks still pass.
- Teacher and expanded pupil views fitted at 1363 × 936. The guide explains card placement, marker use, rule reveal, fixed downloads and random starting numbers, and links to the user’s P3 Number Pattern reference.

Money GitHub-topic update

- Replaced the former Count / Make / Change menu with the user’s full GitHub sequence: Count Money, Money Conversion, Saving Quest (Make $1, $10 or $100), Adding Money, Subtracting Money and P3 Money Word Problems.
- Counting uses simple original value tokens arranged from largest to smallest. Conversion reveals 100-cent grouping or ungrouping one step at a time. Saving Quest checks both the tapped value tokens and the written amount.
- Addition aligns dollars and cents, adds cents first and shows renaming 100 cents as 1 dollar. Subtraction starts with cents and shows renaming 1 dollar as 100 cents when required. Pupils may answer directly or reveal each teaching step.
- Money word problems require the pupil to choose either a Comparison or Part–whole model and then enter the final amount. Find-the-total, find-what-remains and find-the-difference structures use original wording and simple diagrams.
- The teacher guide explains the six tasks, fixed and random downloads, 5-cent input intervals and links to all six of Lim Kim Sze’s reference activities. Real note and coin artwork is not copied.

Money notation and diagram correction

- Replaced the generic Money value tokens with original, labelled diagram drawings adapted from the user’s own Counting Money visual language: round 5¢, 10¢, 20¢ and 50¢ coins, an octagonal $1 coin, and coloured rectangular $2, $5, $10 and $50 notes. These are teaching diagrams rather than reproductions of real currency.
- Teacher fixed-amount fields now show a visible dollar-sign prefix and ordinary decimal money values such as 12.75. Cents → dollars conversion keeps a whole-cent source field; switching the direction changes the input convention and label.
- Mixed pupil answers now form one aligned `$ [dollars] . [cents]` amount. The cents box requires two digits and pads a single digit on blur. Addition and subtraction show the dollar sign and decimal point in every aligned row and result.
- The teacher guide explicitly explains the dollar sign, decimal point, two-digit cents, $0.05 versus $0.50, teacher entry, original diagrams, and fixed/random download behaviour.
- Browser-checked Counting Money, addition, a completed $21.35 answer, direction-sensitive teacher entry and the guide at 1363 × 936. Expanded pupil view used the full 792 px iframe viewport with equal scroll and client heights; no internal scrolling was needed.
