# Mutación

```js
mutate(key, data, options)
```

## Options

- `optimisticData`: data to immediately update the client cache, usually used in optimistic UI.
- `revalidate`: should the cache revalidate once the asynchronous update resolves.
- `populateCache`: should the result of the remote mutation be written to the cache, or a function that receives new result and current result as arguments and returns the mutation result.
- `rollbackOnError`: should the cache rollback if the remote mutation errors.

## Revalidar

You can get the `mutate` function from the `useSWRConfig()` hook, and broadcast a revalidation message
globally to other SWR hooks<sup>\*</sup> using the same key by calling `mutate(key)`.

Este ejemplo muestra cómo recuperar automáticamente la información de login (por ejemplo, dentro de `<Profile/>`)
cuando el usuario hace clic en el botón "Logout".

```jsx
import useSWR, { useSWRConfig } from 'swr'

function App () {
  const { mutate } = useSWRConfig()

  return (
    <div>
      <Profile />
      <button onClick={() => {
        // establecer la cookie como caduca
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

        // indicar a todos SWRs con esta key que se revaliden
        mutate('/api/user')
      }}>
        Logout
      </button>
    </div>
  )
}
```

## Optimistic Updates

In many cases, applying local mutations to data is a good way to make changes
feel faster — no need to wait for the remote source of data.

With `mutate`, you can update your local data programmatically, while
revalidating and finally replace it with the latest data.

```jsx
import useSWR, { useSWRConfig } from 'swr'

function Profile () {
  const { mutate } = useSWRConfig()
  const { data } = useSWR('/api/user', fetcher)

  return (
    <div>
      <h1>My name is {data.name}.</h1>
      <button onClick={async () => {
        const newName = data.name.toUpperCase()
        const user = { ...data, name: newName }
        const options = { optimisticData: user, rollbackOnError: true }

        // updates the local data immediately
        // send a request to update the data
        // triggers a revalidation (refetch) to make sure our local data is correct
        mutate('/api/user', updateFn(user), options);
      }}>Uppercase my name!</button>
    </div>
  )
}
```

> The **`updateFn`** should be a promise or asynchronous function to handle the remote mutation, it should return updated data.

## Mutar basándose en los datos actuales

A veces, se desea actualizar una parte de los datos en función de los datos actuales.

Con `mutate`, puedes pasar una función asíncrona que recibirá el valor actual de la caché, si lo hay, y devolverá un updated document.

```jsx
mutate('/api/todos', async todos => {
  // actualicemos la tarea con ID `1` para que se complete,
  // esta API devuelve los datos acutualizado
  const updatedTodo = await fetch('/api/todos/1', {
    method: 'PATCH',
    body: JSON.stringify({ completed: true })
  })

  // filtrar la lista y devolverla con el item actualizado
  const filteredTodos = todos.filter(todo => todo.id !== '1')
  return [...filteredTodos, updatedTodo]
// Since the API already gives us the updated information,
// we don't need to revalidate here.
}, { revalidate: false })
```

You can also use the `populateCache` option.

```jsx
const updateTodo = () => fetch('/api/todos/1', {
  method: 'PATCH',
  body: JSON.stringify({ completed: true })
})

mutate('/api/todos', updateTodo, {
  populateCache: (updatedTodo, todos) => {
    // filter the list, and return it with the updated item
    const filteredTodos = todos.filter(todo => todo.id !== '1')
    return [...filteredTodos, updatedTodo]
  },
  // Since the API already gives us the updated information,
  // we don't need to revalidate here.
  revalidate: false
})
```

## Datos devueltos por Mutate

Lo más probable es que necesites algunos datos para actualizar la caché. Los datos se resuelven o se devuelven
desde la promise o función asíncrona que pasaste para `mutate`.

La función devolverá update document para que `mutate` actualice el valor de la caché correspondiente. Podría arrojar un error de alguna manera, cada vez que se llame.

```jsx
try {
  const user = await mutate('/api/user', updateUser(newUser))
} catch (error) {
  // Manejar un error al actualizar el user aquí
}
```

## Bound Mutate

El objeto SWR devuelto por `useSWR` también contiene una función `mutate()` que está atada a la key del SWR.

Es funcionalmente equivalente a la función global `mutate` pero no requiere el parámetro `key`.

```jsx
import useSWR from 'swr'

function Profile () {
  const { data, mutate } = useSWR('/api/user', fetcher)

  return (
    <div>
      <h1>My name is {data.name}.</h1>
      <button onClick={async () => {
        const newName = data.name.toUpperCase()
        // enviar una solicitud a la API para actualizar los datos
        await requestUpdateUsername(newName)
        // actualizar los datos locales inmediatamente y revalidar (refetch)
        // NOTA: la key no es necesaria cuando se utiliza el mutate de useSWR, es pre-bound
        mutate({ ...data, name: newName })
      }}>Uppercase my name!</button>
    </div>
  )
}
```
