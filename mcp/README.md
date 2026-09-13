# Local Todo MCP server (ARI-8)

This TypeScript server exposes Todo operations using the official MCP v2 SDK and
local **stdio** transport. No API key or paid service is required.

MCP todos are held in memory in one server process. They start empty, are lost on
restart, and are **separate from the React browser application's state**. There is
no synchronization or persistence. Each separately launched process has its own todos.

| Tool | Input | Result |
| --- | --- | --- |
| `get_app_capabilities` | None | App description, capabilities, and state limitation |
| `list_todos` | None | All todos in this process |
| `add_todo` | `text: string` | Trimmed todo with a unique stable ID, initially incomplete |
| `set_todo_completed` | `id: string`, `completed: boolean` | Updated todo; false uncompletes it |
| `delete_todo` | `id: string` | Deleted todo; other todos remain intact |

Results are JSON encoded in MCP text content. Empty text and unknown IDs return
useful tool errors (`isError: true`). Input types are validated by the SDK.

From the repository root, install with `npm ci`, then run `npm run mcp`.
Use Node.js 20.19+ (or 22.12+), as required by the project's build tooling.
The server waits for MCP messages on stdin; an idle terminal is expected.
Stdout is reserved for MCP protocol messages.

For a client such as Codex or Claude Code, first run `npm run mcp:build`, then
configure its local stdio launcher with command `node` and one argument: the
absolute path to `dist/mcp/server.js`. For this checkout, the exact launch command is:

```powershell
node "D:\Projects\TodoApp\dist\mcp\server.js"
```

This direct launch works from any working directory and avoids npm's console
banner. Rebuild after source changes. `npm run build` also builds the MCP server.
Build output is ignored by Git.

Validation: `npm test -- --run`, `npm run lint`, `npm run build`, and
`npm run mcp:check`. The last command launches a real stdio child process,
discovers all five tools, exercises them, and closes the process.

SDK reference: [official v2 server guide](https://ts.sdk.modelcontextprotocol.io/v2/get-started/first-server).
