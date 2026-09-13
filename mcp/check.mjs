import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { Client } from '@modelcontextprotocol/client'
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio'

const client = new Client({ name: 'todoapp-check', version: '1.0.0' })
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [fileURLToPath(new URL('../dist/mcp/server.js', import.meta.url))],
})

try {
  await client.connect(transport)
  const { tools } = await client.listTools()
  assert.deepEqual(tools.map(({ name }) => name).sort(), [
    'add_todo', 'delete_todo', 'get_app_capabilities', 'list_todos', 'set_todo_completed',
  ])
  const call = (name, args = {}) => client.callTool({ name, arguments: args })
  const value = (result) => {
    assert.ok(!result.isError)
    return JSON.parse(result.content[0].text)
  }
  assert.match(value(await call('get_app_capabilities')).state, /separate from browser/)
  assert.deepEqual(value(await call('list_todos')), [])
  assert.equal((await call('add_todo', { text: '   ' })).isError, true)
  const first = value(await call('add_todo', { text: '  First  ' }))
  const second = value(await call('add_todo', { text: 'Second' }))
  assert.equal(first.text, 'First')
  assert.equal(first.completed, false)
  for (const completed of [true, false]) {
    assert.deepEqual(value(await call('set_todo_completed', { id: first.id, completed })), { ...first, completed })
  }
  value(await call('delete_todo', { id: first.id }))
  assert.deepEqual(value(await call('list_todos')), [second])
  for (const name of ['delete_todo', 'set_todo_completed']) {
    const result = await call(name, { id: first.id, completed: true })
    assert.equal(result.isError, true)
    assert.match(result.content[0].text, /Todo not found/)
  }
  console.log('MCP stdio startup, discovery of all 5 tools, and tool calls passed.')
} finally {
  await client.close()
}
