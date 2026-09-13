import { McpServer } from '@modelcontextprotocol/server'
import { StdioServerTransport } from '@modelcontextprotocol/server/stdio'
import { z } from 'zod'
import { createTodoStore } from './todos.js'

const store = createTodoStore()
const server = new McpServer({ name: 'todoapp', version: '1.0.0' })

function result(operation: () => unknown) {
  try {
    return { content: [{ type: 'text' as const, text: JSON.stringify(operation()) }] }
  } catch (error) {
    return {
      isError: true,
      content: [{ type: 'text' as const, text: error instanceof Error ? error.message : 'Todo operation failed.' }],
    }
  }
}

server.registerTool('get_app_capabilities', {
  description: 'Describe the Todo app and the separate MCP process state.',
}, async () => result(() => ({
  application: 'React + TypeScript Todo app',
  capabilities: ['create todos', 'list todos', 'complete todos', 'uncomplete todos', 'delete todos'],
  state: 'MCP todos exist only in this process and are lost on restart. They are separate from browser state and are not synchronized.',
})))

server.registerTool('list_todos', {
  description: 'List all todos in this MCP process.',
}, async () => result(() => store.list()))

server.registerTool('add_todo', {
  description: 'Create an incomplete todo from non-empty, trimmed text.',
  inputSchema: z.object({ text: z.string() }),
}, async ({ text }) => result(() => store.add(text)))

server.registerTool('set_todo_completed', {
  description: 'Complete or uncomplete a todo by its stable ID.',
  inputSchema: z.object({ id: z.string(), completed: z.boolean() }),
}, async ({ id, completed }) => result(() => store.setCompleted(id, completed)))

server.registerTool('delete_todo', {
  description: 'Delete only the todo with the supplied ID.',
  inputSchema: z.object({ id: z.string() }),
}, async ({ id }) => result(() => store.delete(id)))

await server.connect(new StdioServerTransport())
