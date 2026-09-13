# Discovery Review

Review of the React Todo implementation, tests, MCP server and store, integration check, package scripts/configuration, and GitHub Actions workflows. Findings are scoped to this small evaluation project.

## Validation Performed

- `npm test -- --run` — 13 tests passed
- `npm run lint` — passed
- `npm run build` — passed
- `npm run mcp:check` — passed

Checks used Node 24.16.0; CI specifies Node 20. Tests, build, and MCP integration passed after permitted reruns resolved sandbox child-process restrictions. Hosted workflows, secrets, and branch-protection settings were not verified.

## Dead Code

- **Low — Unused template assets/CSS:** `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg`, and `public/icons.svg` are unreferenced. `src/index.css` retains unused template selectors such as `.counter` and `#social .button-icon`, plus unused accent/shadow variables. Remove these leftovers to reduce clutter while retaining active global styles. No unused application functions were identified.

## Missing Tests

- **Low — React validation (`src/App.test.tsx`):** The empty-input test checks for absent, unrelated task names rather than asserting that no row was created. Whitespace rejection and trimming lack React coverage. Assert an empty list after empty/whitespace submissions and verify padded input is trimmed and the input clears.
- **Low — MCP schema boundary (`mcp/check.mjs`):** Integration checks cover valid arguments and store errors, but not malformed tool arguments. Add missing/wrong-type argument cases, including a string `completed`, and assert rejection without state changes to catch weakened schemas.

## Risks

- **Medium — Incomplete CI enforcement (`.github/workflows/ci.yml`):** CI runs tests and build, but not lint or `mcp:check`. Store tests do not import the server, so registration or stdio regressions could pass. Add both existing commands to CI.
- **Medium — Deleted files omitted from AI review (`.github/workflows/ai-review.yml`):** `--diff-filter=ACMR` excludes deletions from review context. A deletion-only PR could receive a clean review without its changes being examined. Include deletions in the diff and retain file-existence guards for current-file excerpts.
- **Medium — Auto-merge freshness (`.github/workflows/auto-merge.yml`):** Any successful matching workflow run for the head SHA qualifies, even when a newer run is pending or failed. The clean-review comment has no verified SHA/run identity. Require the latest applicable run of each workflow to succeed and stamp/verify the review's head SHA and run identity.
- **Medium — Dark-mode contrast (`src/index.css`, `src/App.css`):** Dark-mode rules make heading text nearly white while the Todo card remains white, producing poor contrast. Align card/text colors or explicitly use a consistent light theme, then verify both system preferences.

## Improvements

- **Low — Root README (`README.md`):** The README remains Vite template documentation, making project setup and MCP instructions harder to discover. Replace it with concise setup and validation commands, state limitations, and a link to `mcp/README.md`.

## Areas Already Well Covered

- React behavior tests cover adding multiple todos, completion in both directions, deletion isolation, and error clearing.
- MCP store tests cover trimming, unique IDs, completion, deletion isolation, and unknown IDs.
- The real stdio MCP integration check verifies startup, discovery, and all five tools. Separate, temporary MCP state is explicitly documented and is not a defect for this scope.
- Auto-merge already includes useful owner-only, same-repository, head-SHA, and mergeability safeguards.

## Discovery Summary

No core functionality submission blocker was demonstrated. Findings comprise one dead-code group, two test gaps, four risks, and one documentation improvement.

Top three recommended follow-up actions:

1. Correct AI review deletion coverage and auto-merge freshness verification before relying on unattended merging.
2. Add the existing lint and MCP integration checks to CI.
3. Fix dark-mode heading contrast.

Overall readiness: ready for a small coding evaluation, with passing local checks and targeted follow-ups. Hosted workflow execution and repository protection settings remain unverified.
