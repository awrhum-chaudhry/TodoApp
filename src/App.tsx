import { useState, type FormEvent } from 'react'
import './App.css'

function App() {
  const [todoText, setTodoText] = useState('')
  const [todos, setTodos] = useState<string[]>([])
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

    setTodos((currentTodos) => [...currentTodos, trimmedText])
    setTodoText('')
    setError('')
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
          <li key={`${todo}-${index}`}>{todo}</li>
        ))}
      </ul>
    </main>
  )
}

export default App
