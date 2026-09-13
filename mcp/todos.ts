import { randomUUID } from 'node:crypto'

export type Todo = { id: string; text: string; completed: boolean }

export function createTodoStore() {
  const todos = new Map<string, Todo>()

  function get(id: string) {
    const todo = todos.get(id)
    if (!todo) throw new Error(`Todo not found: ${id}`)
    return todo
  }

  return {
    list: () => Array.from(todos.values(), (todo) => ({ ...todo })),
    add(text: string) {
      const trimmed = text.trim()
      if (!trimmed) throw new Error('Please enter a todo.')
      const todo = { id: randomUUID(), text: trimmed, completed: false }
      todos.set(todo.id, todo)
      return { ...todo }
    },
    setCompleted(id: string, completed: boolean) {
      const todo = get(id)
      todo.completed = completed
      return { ...todo }
    },
    delete(id: string) {
      const todo = get(id)
      todos.delete(id)
      return { ...todo }
    },
  }
}
