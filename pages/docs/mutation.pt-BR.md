# Mutação

SWR provides the [`mutate`](/docs/mutation#mutate) and [`useSWRMutation`](/docs/mutation#useswrmutation) APIs for mutating remote data and related cache.

## mutate

There're 2 ways to use the `mutate` API to mutate the data, the global mutate API which can mutate any key and the bound mutate API which only can mutate the data of corresponding SWR hook.

#### Global Mutate

```js
import { mutate as globalMutate, useSWRConfig } from "swr"

function App() {
  const { mutate } = useSWRConfig()
  const data = mutate(key, data, options)

  // Or you can use globalMutate directly
  // await globalMutate(key, data, options)

}
```
#### Bound Mutate

[Bound Mutate](/docs/mutation#bound-mutate) is the short path to mutate the current key with data. Which `key` is bounded to the `key` passing to SWR, and receive the `data` as the first argument.


```js
const { mutate } = useSWR(key, fetcher)

await mutate(data)
```

### API

#### Parameters

- `key`: same as `useSWR`'s `key`, but a function behaves as [a filter function](/docs/mutation#mutate-multiple-items)
- `data`: data to update the client cache, or an async function for the remote mutation
- `options`: accepts the following options
  - `optimisticData(currentData)`: data to immediately update the client cache, or a function that receives current data and returns the new client cache data, usually used in optimistic UI.
  - `revalidate = true`: should the cache revalidate once the asynchronous update resolves.
  - `populateCache = true`: should the result of the remote mutation be written to the cache, or a function that receives new result and current result as arguments and returns the mutation result.
  - `rollbackOnError = true`: should the cache rollback if the remote mutation errors.

#### Return Values

`mutate` returns the results the `data` parameter has been resolved. The function passed to `mutate` will return an updated data which is used to update the corresponding cache value. If there is an error thrown while executing the function, the error will be thrown so it can be handled appropriately.

```jsx
try {
  const user = await mutate('/api/user', updateUser(newUser))
} catch (error) {
  // Lide com um erro enquanto atualiza o usuário aqui
}
```

## Revalidar

Você pode obter a função `mutate` do hook `useSWRConfig()`, e transmitir uma mensagem de revalidação global
para outros hooks SWR<sup>\*</sup> usando a mesma chave chamando `mutate(key)`.

Esse exemplo mostra como recuperar automaticamente as informações de login (ex. dentro de `<Profile/>`)

```jsx
import useSWR, { useSWRConfig } from 'swr'

function App () {
  const { mutate } = useSWRConfig()

  return (
    <div>
      <Profile />
      <button onClick={() => {
        // define o cooke como expirado
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

        // avisa todos os SWR com essa chave para revalidar
        mutate('/api/user')
      }}>
        Logout
      </button>
    </div>
  )
}
```

\*: _É transmitido para os hooks SWR no mesmo escopo do [cache provider](/docs/advanced/cache). Se nenhum cache provider existir, será transmitido para todos os hooks SWR._

## Updates Otimistas

Em muitos casos, aplicar mutações locais aos dados é uma boa maneira de fazer alterações
parecerem mais rápidas — não precisa esperar para a fonte de dados remota.

Com `mutate`, você pode atualizar seus dados localmente, enquanto revalidar e
depois substituir por os dados mais recentes.

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

        // atualiza os dados locais imediatamente
        // envia um pedido para atualizar os dados
        // dispara uma revalidação (refetch) para garantir que os nossos dados locais são corretos
        mutate('/api/user', updateFn(user), options);
      }}>Uppercase my name!</button>
    </div>
  )
}
```

> **`updateFn`** deve ser uma promise ou uma função assíncrona para lidar com a mutação remota, e deve retornar os dados atualizados.

You can also pass a function to `optimisticData`.

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
        mutate('/api/user', updateUserName(newName), {
            optimisticData: user => ({ ...data, name: newName }),
            rollbackOnError: true
        });
      }}>Uppercase my name!</button>
    </div>
  )
}
```

## Mutação Baseada nos Dados Atuais

As vezes, você quer atualizar uma parte de seus dados baseado nos dados atuais.

Com `mutate`, você pode passar uma função assíncrona que recebe o valor atual do cache, se houver, e retorna um documento atualizado.

```jsx
mutate('/api/todos', async todos => {
  // Vamos atualizar o todo com ID `1` para ser completado,
  // essa API retorna os dados atualizados
  const updatedTodo = await fetch('/api/todos/1', {
    method: 'PATCH',
    body: JSON.stringify({ completed: true })
  })

  // filtra a lista, e retorna com o item atualizado
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

## Mutate Multiple Items

`mutate` accepts a filter function, which accepts `key` as the argument and returns which keys to revalidate. The filter function is applied to all the existing cache keys.

```jsx
import { mutate } from 'swr'
// Or from the hook if you customized the cache provider:
// { mutate } = useSWRConfig()

mutate(
  key => typeof key === 'string' && key.startsWith('/api/item?id='),
  undefined,
  { revalidate: true }
)
```

This also works with any key type like an array. The mutation matches all keys, of which the first element is `'item'`.

```jsx
useSWR(['item', 123], ...)
useSWR(['item', 124], ...)
useSWR(['item', 125], ...)

mutate(
  key => Array.isArray(key) && key[0] === 'item',
  undefined,
  { revalidate: false }
)
```

The filter function is applied to all existing cache keys, so you should not assume the shape of keys when using multiple shapes of keys.

```jsx
// ✅ matching array key
mutate((key) => key[0].startsWith('/api'), data)
// ✅ matching string key
mutate((key) => typeof key === 'string' && key.startsWith('/api'), data)

// ❌ mutate all when key's type is unsure (array or string)
mutate((key: any) => /\/api/.test(key.toString()))
```

You can use the filter function to clear all cache data, which is useful when logging out.


```js
mutate(
  () => true,
  undefined,
  { revalidate: false }
)
```

But it is unclear what it does, so you can name it `clearCache`.

```js
const clearCache = () => mutate(
  () => true,
  undefined,
  { revalidate: false }
)
```

## Mutação Vinculada

O objeto SWR retornado por `useSWR` também contém uma função `mutate()` que é vinculada ao chave do SWR.

É funcionalmente equivalente à função global `mutate` mas não requer o parâmetro key.

```jsx
import useSWR from 'swr'

function Profile () {
  const { data, mutate } = useSWR('/api/user', fetcher)

  return (
    <div>
      <h1>My name is {data.name}.</h1>
      <button onClick={async () => {
        const newName = data.name.toUpperCase()
        // envia um pedido para a API para atualizar os dados
        await requestUpdateUsername(newName)
        // atualiza os dados locais e revalida (refetch)
        // NOTA: key não é mais necessária quando usando o mutate do useSWR, já que é pré-vinculado
        mutate({ ...data, name: newName })
      }}>Uppercase my name!</button>
    </div>
  )
}
```

## useSWRMutation

SWR also provides `useSWRMutation` as a hook for remote mutations. The remote mutations are only triggered manually, instead of automatically like `useSWR`.

```jsx
import useSWRMutation from 'swr/mutation'

async function getData(url, { arg }) {
  // Fetcher implementation.
  // The extra argument will be passed via the `arg` property of the 2nd parameter.
  // For the example below, `arg` will be `'my_token'`
}

// A useSWR + mutate like API, but it will never start the request.
const { data, error, trigger, reset, isMutating } = useSWRMutation('/api/user', getData, options?)
trigger('my_token');
```

### API

#### Parameters

- `key`: same as [`mutate`](/docs/mutation#mutate)'s `key`
- `fetcher(key, { arg })`: an async function for remote mutation
- `options`: accepts the following options
  - `optimisticData(currentData)`: same as `mutate`'s `optimisticData`
  - `revalidate = true`: same as `mutate`'s `revalidate`
  - `populateCache = false`: same as `mutate`'s `populateCache`, but the default is `false`
  - `rollbackOnError = true`: same as `mutate`'s `rollbackOnError`
  - `onSuccess(data, key, config)`:　callback function when a remote mutation has been finished successfully
  - `onError(err, key, config)`: callback function when a remote mutation has returned an error

#### Return Values

- `data`: data for the given key returned from `fetcher`
- `error`: error thrown by `fetcher` (or undefined)
- `trigger(arg, options)`: a function to trigger a remote mutation
- `reset`: a function to reset the state (`data`, `error`, `isMutating`)
- `isMutating`: if there's an ongoing remote mutation

### Basic Examples

```jsx
import useSWRMutation from 'swr/mutation'

async function sendRequest(url, { arg }) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg)
  })
}

function App() {
  const { trigger, isMutating } = useSWRMutation('/api/user', sendRequest, /* options */)

  return (
    <button
      disabled={isMutating}
      onClick={async () => {
        try {
          const result = await trigger({ username: 'johndoe' }, /* options */)
        } catch (e) {
          // error handling
        }
      }}
    >
      Create User
    </button>
  )
}
```

If you want to use the mutation results in rendering, you can get them from the return values of `useSWRMutation`.

```jsx
const { trigger, data, error } = useSWRMutation('/api/user', sendRequest)
```

`useSWRMutation` shares a cache store with `useSWR`, so it can detect and avoid race conditions between `useSWR`. It also supports `mutate`'s functionalities like optimistic updates and rollback on errors. You can pass these options `useSWRMutation` and its `trigger` function.

```jsx
const { trigger } = useSWRMutation('/api/user', updateUser, {
  optimisticData: current => ({ ...current, name: newName })
})

// or

trigger(newName, {
  optimisticData: current => ({ ...current, name: newName })
})
```

### Defer loading data until needed

You can also use `useSWRMutation` for loading data. `useSWRMutation` never start requesting until `trigger` is called, so you can defer loading data when you actually need it.

```jsx
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'

const fetcher = url => fetch(url).then(res => res.json())

const Page = () => {
  const [show, setShow] = useState(false)
  // data is undefined until trigger is called
  const { data: user, trigger } = useSWRMutation('/api/user', fetcher);

  return (
    <div>
      <button onClick={() => {
        trigger();
        setShow(true);
      }}>Show User</button>
      {show && user ? <div>{usre.name}</div> : null}
    </div>
  );
}
```
