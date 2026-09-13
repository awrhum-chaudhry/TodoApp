# TodoApp — AI-Driven Development Evaluation

A small Todo application built for the Shayan Solutions coding evaluation. The focus is the AI-orchestrated software development workflow, not application complexity.

## Features

- Create todos with stable IDs.
- Complete and uncomplete todos.
- Delete individual todos.
- Reject empty or whitespace-only input and trim todo text.

## Tech Stack

- React, TypeScript, and Vite for the application.
- Vitest and React Testing Library for tests.
- GitHub Actions for CI, Gemini-based AI PR review, and auto-merge.
- Model Context Protocol (MCP) for local Todo tools.
- Codex for AI-assisted implementation and MCP verification.
- Claude Code configuration evidence; live tool execution was not completed.
- Linear for ticket tracking.

## Agentic Development Workflow

Linear ticket → AI coding agent → feature branch → pull request → CI → AI PR review → findings/fixes when needed → clean review → auto-merge → Linear Done.

PR #3 was the first full successful auto-merge demonstration. PR #4 demonstrated the MCP implementation. Linear status updates were tracked separately; this workflow does not claim automated Linear transitions.

## Linear Workflow

The statuses used were **Todo**, **In Progress**, and **Done**. This workspace did not expose an **In Review** state, so work remained **In Progress** during review and moved to **Done** after merge.

## CI

[CI](.github/workflows/ci.yml) runs on pull requests targeting `main` and pushes to `main`. It uses Node 20, installs with `npm ci`, then runs `npm test -- --run` and `npm run build`. Tests and build have been passing.

CI does not currently run lint or `mcp:check`. Discovery validation passed all four local commands below, including 13 tests.

## AI Pull Request Review

The [AI review workflow](.github/workflows/ai-review.yml) calls Gemini and posts or updates a structured PR comment. Findings can block auto-merge and drive fixes. The merge workflow requires this exact clean approval sentence:

> PR is approved/clean. No significant issues or findings were found.

PR #3 had genuine findings that were fixed. PR #4 had one false-positive SDK finding, independently checked against the installed MCP SDK; a subsequent clean review rerun approved it.

## Auto-Merge

The [auto-merge workflow](.github/workflows/auto-merge.yml) requires:

- A same-repository PR created by the repository owner; organization-owned repositories are excluded.
- The PR's exact head SHA to match the evaluated commit.
- Successful CI and AI review workflow runs for that SHA.
- A marked GitHub Actions bot review comment containing the clean approval sentence and no `## Findings`.
- The PR to remain open with the same head SHA and a clean mergeability state.

It submits a squash merge with the expected SHA. These are the implemented checks; latest-run and review-comment freshness limitations are documented in [DISCOVERY.md](DISCOVERY.md).

## MCP Server

The local TypeScript MCP server uses stdio transport and requires no API key for the server itself. Todo state is in memory, belongs to one server process, and is lost on restart. It is separate from browser Todo state.

Available tools:

- `get_app_capabilities`
- `list_todos`
- `add_todo`
- `set_todo_completed`
- `delete_todo`

See [mcp/README.md](mcp/README.md) for tool inputs, results, and server details.

## MCP Verification

### Codex

Codex successfully connected and demonstrated tool discovery, capabilities lookup, listing todos, adding a todo, completing it, deleting it, and confirming a final empty list.

### Claude Code

Claude Code was installed locally, the `todoapp` MCP server was added successfully, and `claude mcp list` showed it as connected. Full live tool execution was not completed because Claude Code required a paid Claude subscription or API billing. No paid Claude access was purchased for this evaluation; Claude did not execute the MCP tools.

## Discovery Review

[DISCOVERY.md](DISCOVERY.md) records the review of dead code, missing tests, risks, and possible improvements. No core functionality submission blocker was found.

## Local Setup

Use Node.js 20.19+ or 22.12+ as documented for the build tooling.

```bash
npm ci
npm run dev
```

Validate locally:

```bash
npm test -- --run
npm run lint
npm run build
npm run mcp:check
```

Build or launch the MCP server:

```bash
npm run mcp:build
npm run mcp
```

`npm run mcp` builds and starts the stdio server; waiting for input is expected. `npm run build` builds both the frontend and MCP server. `npm run mcp:check` builds and exercises the server through a real stdio client.

## MCP Client Setup

Run `npm run mcp:build`, then configure a local stdio server named `todoapp` in Codex or Claude Code with these launcher values:

```text
Transport: stdio
Command: node
Arguments: ["<absolute-path-to-repo>/dist/mcp/server.js"]
```

Replace the placeholder with the repository's absolute path. This is a generic launcher example, not a client-specific configuration file. Launch Node directly to keep npm's console banner out of the protocol stream; rebuild after server source changes.

## Project Evidence

- [PR #1](https://github.com/awrhum-chaudhry/TodoApp/pull/1) — Todo creation and bootstrap.
- [PR #2](https://github.com/awrhum-chaudhry/TodoApp/pull/2) — Complete/uncomplete and bootstrap workflow fix.
- [PR #3](https://github.com/awrhum-chaudhry/TodoApp/pull/3) — Delete todo, AI findings and fixes, and the first full auto-merge loop.
- [PR #4](https://github.com/awrhum-chaudhry/TodoApp/pull/4) — MCP server and Codex MCP verification.
- [PR #5](https://github.com/awrhum-chaudhry/TodoApp/pull/5) — Discovery report.

## Demo Flow

Suggested 3–5 minute screen recording:

1. Show the Linear ticket and status.
2. Show the Codex implementation session.
3. Open its PR and changes.
4. Show passing CI.
5. Show AI findings, fixes, and the clean review.
6. Show the completed auto-merge.
7. Show the MCP connection.
8. Demonstrate MCP capabilities Q&A and Todo tool execution.
9. Open the discovery report and follow-up recommendations.

## Limitations

- MCP Todo state is process-local and not synchronized with browser Todo state. MCP todos are lost when the MCP server restarts, and browser todos are lost when the page reloads because no persistence layer is implemented.
- Claude live MCP execution was not completed because paid access was required.
- This is intentionally a small evaluation project; remaining review findings are recorded in `DISCOVERY.md`.

## Status

The required core workflow, MCP server, Codex MCP verification, discovery report, CI, AI review, and auto-merge have been demonstrated working. Claude Code evidence is limited to configuration and connection.
