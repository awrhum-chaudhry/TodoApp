// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createTodoStore } from './todos.js'

describe('MCP todo store', () => {
  it('rejects whitespace-only text', () => {
    const store = createTodoStore()
    expect(() => store.add(' \t\n ')).toThrow('Please enter a todo.')
    expect(store.list()).toEqual([])
  })

  it('adds trimmed, incomplete todos with unique IDs and lists them', () => {
    const store = createTodoStore()
    const first = store.add('  Buy milk  ')
    const second = store.add('Buy milk')
    expect(first).toEqual({ id: expect.any(String), text: 'Buy milk', completed: false })
    expect(first.id).not.toBe(second.id)
    expect(store.list()).toEqual([first, second])
  })

  it('completes and uncompletes a todo by stable ID', () => {
    const store = createTodoStore()
    const todo = store.add('Read')
    expect(store.setCompleted(todo.id, true)).toEqual({ ...todo, completed: true })
    expect(store.list()[0].completed).toBe(true)
    expect(store.setCompleted(todo.id, false)).toEqual(todo)
    expect(store.list()).toEqual([todo])
  })

  it('deletes only the selected todo', () => {
    const store = createTodoStore()
    const first = store.add('First')
    const second = store.add('Second')
    expect(store.delete(first.id)).toEqual(first)
    expect(store.list()).toEqual([second])
  })

  it('reports useful errors for unknown IDs', () => {
    const store = createTodoStore()
    expect(() => store.setCompleted('missing', true)).toThrow('Todo not found: missing')
    expect(() => store.setCompleted('missing', false)).toThrow('Todo not found: missing')
    expect(() => store.delete('missing')).toThrow('Todo not found: missing')
  })
})
