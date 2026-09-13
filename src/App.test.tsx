import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  it('allows a user to add a todo from text input', async () => {
    const user = userEvent.setup()

    render(<App />)

    const input = screen.getByLabelText(/todo text/i)
    await user.type(input, 'Buy milk')
    await user.click(screen.getByRole('button', { name: /add todo/i }))

    expect(screen.getByText('Buy milk')).toBeInTheDocument()
  })

  it('allows a user to complete a todo', async () => {
    const user = userEvent.setup()

    render(<App />)

    const input = screen.getByLabelText(/todo text/i)
    await user.type(input, 'Buy milk')
    await user.click(screen.getByRole('button', { name: /add todo/i }))
    await user.click(screen.getByRole('button', { name: /mark buy milk as complete/i }))

    expect(screen.getByText('Buy milk').closest('li')).toHaveClass('completed')
    expect(screen.getByRole('button', { name: /mark buy milk as incomplete/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('allows a user to toggle a completed todo back to incomplete', async () => {
    const user = userEvent.setup()

    render(<App />)

    const input = screen.getByLabelText(/todo text/i)
    await user.type(input, 'Buy milk')
    await user.click(screen.getByRole('button', { name: /add todo/i }))
    await user.click(screen.getByRole('button', { name: /mark buy milk as complete/i }))
    await user.click(screen.getByRole('button', { name: /mark buy milk as incomplete/i }))

    expect(screen.getByText('Buy milk').closest('li')).not.toHaveClass('completed')
    expect(screen.getByRole('button', { name: /mark buy milk as complete/i })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('deletes the selected todo', async () => {
    const user = userEvent.setup()

    render(<App />)

    const input = screen.getByLabelText(/todo text/i)
    await user.type(input, 'Buy milk')
    await user.click(screen.getByRole('button', { name: /add todo/i }))
    await user.click(screen.getByRole('button', { name: /delete buy milk/i }))

    expect(screen.queryByText('Buy milk')).not.toBeInTheDocument()
  })

  it('keeps other todos when one todo is deleted', async () => {
    const user = userEvent.setup()

    render(<App />)

    const input = screen.getByLabelText(/todo text/i)
    await user.type(input, 'Buy milk')
    await user.click(screen.getByRole('button', { name: /add todo/i }))
    await user.type(input, 'Wash dishes')
    await user.click(screen.getByRole('button', { name: /add todo/i }))
    await user.click(screen.getByRole('button', { name: /delete buy milk/i }))

    expect(screen.queryByText('Buy milk')).not.toBeInTheDocument()
    expect(screen.getByText('Wash dishes')).toBeInTheDocument()
  })

  it('rejects empty todo text', async () => {
    const user = userEvent.setup()

    render(<App />)

    const input = screen.getByLabelText(/todo text/i)
    await user.clear(input)
    await user.click(screen.getByRole('button', { name: /add todo/i }))

    expect(screen.queryByText(/buy milk|wash dishes/i)).not.toBeInTheDocument()
    expect(screen.getByText(/please enter a todo/i)).toBeInTheDocument()
  })

  it('clears the empty todo error when typing a valid todo', async () => {
    const user = userEvent.setup()

    render(<App />)

    const input = screen.getByLabelText(/todo text/i)
    await user.click(screen.getByRole('button', { name: /add todo/i }))
    expect(screen.getByText(/please enter a todo/i)).toBeInTheDocument()

    await user.type(input, 'Buy milk')

    expect(screen.queryByText(/please enter a todo/i)).not.toBeInTheDocument()
  })

  it('adds multiple todos to the list', async () => {
    const user = userEvent.setup()

    render(<App />)

    const input = screen.getByLabelText(/todo text/i)
    await user.type(input, 'Buy milk')
    await user.click(screen.getByRole('button', { name: /add todo/i }))
    await user.type(input, 'Wash dishes')
    await user.click(screen.getByRole('button', { name: /add todo/i }))

    expect(screen.getByText('Buy milk')).toBeInTheDocument()
    expect(screen.getByText('Wash dishes')).toBeInTheDocument()
  })
})
