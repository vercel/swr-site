// These source strings are editable files in the browser playground.
export const examples: Record<string, Record<string, string>> = {
  "error-handling": {
    "pages/index.jsx": `import useSWR from 'swr'
import { useState } from 'react'
import '../styles.css'

async function fetcher([key, shouldFail]) {
  await new Promise((resolve) => setTimeout(resolve, 800))
  if (shouldFail) throw new Error('The simulated request failed. Try again!')
  return { message: 'Data loaded successfully.' }
}

export default function App() {
  const [shouldFail, setShouldFail] = useState(true)
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    ['message', shouldFail], fetcher, { shouldRetryOnError: false }
  )

  return (
    <main>
      <h1>Error handling</h1>
      <p>This fetcher simulates a slow request that can fail.</p>
      <label>
        <input type="checkbox" checked={shouldFail}
          onChange={(event) => setShouldFail(event.target.checked)} />
        Fail the request
      </label>
      {isLoading && <p>Loading…</p>}
      {error && <p role="alert">{error.message}</p>}
      {data && <p>{data.message}</p>}
      <button onClick={() => mutate()} disabled={isValidating}>Retry</button>
    </main>
  )
}`,
  },
  auth: {
    "pages/index.jsx": `import useSWR from 'swr'
import { useState } from 'react'
import { getUser, login, logout } from '../api'
import '../styles.css'

function Profile() {
  const { data: user, isLoading } = useSWR('user', getUser)
  if (isLoading) return <p>Loading profile…</p>
  return <p>{user ? 'Welcome, ' + user.name + '!' : 'You are logged out.'}</p>
}

export default function App() {
  const { data: user, mutate, isLoading } = useSWR('user', getUser)
  const [busy, setBusy] = useState(false)

  async function changeSession() {
    setBusy(true)
    try {
      if (user) await logout()
      else await login()
      await mutate()
    } finally {
      setBusy(false)
    }
  }

  return (
    <main>
      <h1>Authentication</h1>
      <p>A simulated session: logging in updates every component sharing the user key.</p>
      <Profile />
      <button disabled={busy || isLoading} onClick={changeSession}>
        {busy ? 'Updating…' : user ? 'Log out' : 'Log in as Ada'}
      </button>
      <Profile />
    </main>
  )
}`,
    "api.js": `// In-memory demo only. A real application uses an authenticated server API.
let user = null
const delay = () => new Promise((resolve) => setTimeout(resolve, 500))

export async function getUser() {
  await delay()
  return user
}

export async function login() {
  await delay()
  user = { name: 'Ada' }
}

export async function logout() {
  await delay()
  user = null
}`,
  },
  "infinite-loading": {
    "pages/index.jsx": `import useSWRInfinite from 'swr/infinite'
import { fetchPage } from '../api'
import '../styles.css'

const getKey = (pageIndex, previousPage) => {
  if (previousPage && !previousPage.length) return null
  return ['items', pageIndex]
}

export default function App() {
  const { data, error, size, setSize, isValidating } = useSWRInfinite(getKey, fetchPage)
  const items = data ? data.flat() : []
  const isLoadingMore = !data || data[size - 1] === undefined
  const isEmpty = data?.[data.length - 1]?.length === 0

  return (
    <main>
      <h1>Infinite loading</h1>
      <p>Load a simulated collection five items at a time.</p>
      {error && <p role="alert">{error.message}</p>}
      <ul>{items.map((item) => <li key={item.id}>{item.title}</li>)}</ul>
      <button disabled={isLoadingMore || isValidating || isEmpty}
        onClick={() => setSize(size + 1)}>
        {isEmpty ? 'No more items' : isLoadingMore ? 'Loading…' : 'Load more'}
      </button>
    </main>
  )
}`,
    "api.js": `const items = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  title: 'Item ' + (i + 1),
}))

export async function fetchPage([key, pageIndex]) {
  await new Promise((resolve) => setTimeout(resolve, 600))
  return items.slice(pageIndex * 5, (pageIndex + 1) * 5)
}`,
  },
  "optimistic-ui": {
    "pages/index.jsx": `import useSWR from 'swr'
import { useState } from 'react'
import { getTodos, addTodo } from '../api'
import '../styles.css'

export default function App() {
  const { data: todos = [], mutate, isLoading } = useSWR('todos', getTodos)
  const [text, setText] = useState('Learn SWR')
  const [shouldFail, setShouldFail] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    if (!text.trim() || saving) return
    const todo = { id: crypto.randomUUID(), text: text.trim() }
    setSaving(true)
    setError('')
    try {
      await mutate(addTodo(todo, shouldFail), {
        optimisticData: (current = []) => [...current, todo],
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      })
      setText('')
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main>
      <h1>Optimistic UI</h1>
      <p>Items appear immediately. A failed save rolls the list back.</p>
      <form onSubmit={submit}>
        <input aria-label="New todo" value={text} onChange={(event) => setText(event.target.value)} />
        <button disabled={saving || isLoading || !text.trim()}>Add</button>
      </form>
      <label><input type="checkbox" checked={shouldFail}
        onChange={(event) => setShouldFail(event.target.checked)} /> Fail the save</label>
      {isLoading && <p>Loading…</p>}
      <ul>{todos.map((todo) => <li key={todo.id}>{todo.text}</li>)}</ul>
      {saving && <p>Saving…</p>}
      {error && <p role="alert">{error}</p>}
    </main>
  )
}`,
    "api.js": `let todos = [{ id: '1', text: 'Try optimistic updates' }]

export async function getTodos() {
  return [...todos]
}

export async function addTodo(todo, shouldFail) {
  await new Promise((resolve) => setTimeout(resolve, 1500))
  if (shouldFail) throw new Error('Save failed. The optimistic item was rolled back.')
  todos = [...todos, todo]
  return [...todos]
}`,
  },
  subscription: {
    "pages/index.jsx": `import useSWRSubscription from 'swr/subscription'
import { useState } from 'react'
import '../styles.css'

function subscribe(key, { next }) {
  // Simulate a push source. A real app could listen to a WebSocket here.
  let count = 0
  const timer = setInterval(() => {
    next(null, { count: ++count, time: new Date().toLocaleTimeString() })
  }, 1000)
  return () => clearInterval(timer)
}

export default function App() {
  const [connected, setConnected] = useState(true)
  const { data, error } = useSWRSubscription(connected ? 'clock' : null, subscribe)

  return (
    <main>
      <h1>Subscription</h1>
      <p>A simulated event stream pushes a new value every second.</p>
      {error && <p role="alert">{error.message}</p>}
      <p>{!connected ? 'Disconnected' : data ? 'Event ' + data.count + ' at ' + data.time : 'Waiting for an event…'}</p>
      <button onClick={() => setConnected(!connected)}>
        {connected ? 'Disconnect' : 'Connect'}
      </button>
      <p>Disconnecting cleans up the subscription.</p>
    </main>
  )
}`,
  },
};
