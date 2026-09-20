# Primary Maths Studio

15 engine tabs for Singapore P1–P3 classroom mathematics. Created by Lim Kim Sze.

The three measurement engines preserve the completed length, mass and volume activities. Twelve additional engines share a configuration, generation and checking core. Only the selected engine workspace is mounted.

The grade presets were checked against MOE's 2021 Primary Mathematics syllabus, updated October 2025, pages 31–36. This toolkit covers selected reusable activity types, not every syllabus objective. Original questions and diagrams are used; exact textbook-page alignment is not claimed.

## Development

Run `node scripts/assemble-engines.mjs` after editing `engine-src/`. It generates the standalone HTML and the download endpoint's template from the same source. Use the project package manager and existing Sites build workflow.

`node checks/check-engines.mjs` checks all new grade/task combinations, generated questions and arithmetic edge cases. `node checks/check-downloads.mjs` checks configured HTML, HTML/JSON download responses and invalid requests. The latter creates temporary `public/qa` samples for preview QA; remove those samples before the final build.

Fixed activities contain one exact example. Random practice generates a fresh set each time it starts, preserving the shown controls and grade ranges. Downloaded copies never update themselves. Results are session-local; JSON saves configuration only. Standalone downloads have no external assets and need no account. No xAPI reporting or SLS certification is claimed.

Optional WebMCP tools are feature-detected. The current browser QA environment does not expose the modelContext API, so tool validation was unavailable.
