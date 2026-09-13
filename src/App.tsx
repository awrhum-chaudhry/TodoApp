import { useState, type FormEvent } from 'react'
import './App.css'

type Todo = {
  text: string
  completed: boolean
}

function App() {
  const [todoText, setTodoText] = useState('')
  const [todos, setTodos] = useState<Todo[]>([])
  const [error, setError] = useState('')

  const handleTodoChange = (value: string) => {
    setTodoText(value)

    if (value.trim()) {
      setError('')
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedText = todoText.trim()

    if (!trimmedText) {
      setError('Please enter a todo.')
      return
    }

    setTodos((currentTodos) => [
      ...currentTodos,
      { text: trimmedText, completed: false },
    ])
    setTodoText('')
    setError('')
  }

  const handleTodoToggle = (index: number) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo, todoIndex) =>
        todoIndex === index ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }

  const handleTodoDelete = (index: number) => {
    setTodos((currentTodos) =>
      currentTodos.filter((_, todoIndex) => todoIndex !== index),
    )
  }

  return (
    <main className="todo-app">
      <h1>Todo App</h1>

      <form onSubmit={handleSubmit} className="todo-form">
        <label htmlFor="todo-input">Todo text</label>
        <div className="todo-input-row">
          <input
            id="todo-input"
            name="todoText"
            type="text"
            value={todoText}
            onChange={(event) => handleTodoChange(event.target.value)}
            aria-label="Todo text"
            placeholder="Enter a todo"
          />
          <button type="submit">Add todo</button>
        </div>
        {error ? <p className="error-message">{error}</p> : null}
      </form>

      <ul className="todo-list" aria-label="Todo list">
        {todos.map((todo, index) => (
          <li
            key={`${todo.text}-${index}`}
            className={todo.completed ? 'completed' : undefined}
          >
            <button
              type="button"
              className="todo-toggle"
              aria-label={
                todo.completed
                  ? `Mark ${todo.text} as incomplete`
                  : `Mark ${todo.text} as complete`
              }
              aria-pressed={todo.completed}
              onClick={() => handleTodoToggle(index)}
            >
              {todo.completed ? 'Completed' : 'Complete'}
            </button>
            <span>{todo.text}</span>
            <button
              type="button"
              className="todo-delete"
              aria-label={`Delete ${todo.text}`}
              onClick={() => handleTodoDelete(index)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
