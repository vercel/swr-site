# Мутация

SWR provides the `mutate` and `useSWRMutation` APIs for mutating remote data and related cache.

## mutate

```js
import { mutate, useSWRConfig } from "swr"

function App() {
  // Or from the useSWRConfig hook
  // const { mutate } = useSWRConfig()
  const data = await mutate(key, data, options)
}
```

You can get [bound mutate](/docs/mutation#bound-mutate) from `useSWR`.

```js
const { mutate } = useSWR(key, fetcher)
```

### API

#### Parameters

- `key`: same as `useSWR`'s `key`
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
  // Обработайте ошибку здесь при обновлении пользователя
}
```

## Ревалидация

Вы можете получить функцию `mutate` из хука `useSWRConfig()`, и передать сообщение о ревалидации глобально другим SWR хукам<sup>\*</sup>, используя тот же ключ, вызвав `mutate(key)`.

В этом примере показано, как автоматически обновлять информацию для входа (например, внутри `<Profile />`), когда пользователь нажимает кнопку «Выйти».

```jsx
import useSWR, { useSWRConfig } from 'swr'

function App () {
  const { mutate } = useSWRConfig()

  return (
    <div>
      <Profile />
      <button onClick={() => {
        // установить cookie как просроченный
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

        // сообщить всем SWR с этим ключём, чтобы они ревалидировали
        mutate('/api/user')
      }}>
        Выйти
      </button>
    </div>
  )
}
```

\*: _Транслируется всем SWR хукам с той же областью действия [кеш провайдера](/docs/cache). Если кеш-провайдера не существует, будет транслироваться на все SWR хуки._

## Оптимистичные обновления

Во многих случаях применение локальных мутаций к данным — хороший способ ускорить внесение изменений — не нужно ждать удаленного источника данных.

С помощью `mutate` вы можете обновлять локальные данные программно, пока идёт ревалидация и, в итоге, заменить их свежими данными.

```jsx
import useSWR, { useSWRConfig } from 'swr'

function Profile () {
  const { mutate } = useSWRConfig()
  const { data } = useSWR('/api/user', fetcher)

  return (
    <div>
      <h1>Меня зовут {data.name}.</h1>
      <button onClick={async () => {
        const newName = data.name.toUpperCase()
        const user = { ...data, name: newName }
        const options = { optimisticData: user, rollbackOnError: true }

        // немедленно обновляет локальные данные
        // отправляем запрос на обновление данных
        // запускает ревалидацию (обновление), чтобы убедиться, что наши локальные данные верны
        mutate('/api/user', updateFn(user), options);
      }}>Перевести моё имя в верхнии регистр!</button>
    </div>
  )
}
```

> **`updateFn`** должена быть промисом или асинхронной функцией для обработки удаленной мутации, она должна возвращать обновленные данные.

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

## Мутировать на основе текущих данных

Иногда вы хотите обновить часть ваших данных на основе текущих данных.

С помощью `mutate` вы можете передать асинхронную функцию, которая получит текущее закешированное значение, если оно есть, и вернет обновленный документ.

```jsx
mutate('/api/todos', async todos => {
  // давайте обновим todo с ID равным `1`, и пометим его завершённым,
  // этот API возвращает обновлённые данные
  const updatedTodo = await fetch('/api/todos/1', {
    method: 'PATCH',
    body: JSON.stringify({ completed: true })
  })

  // отфильтруем список и вернём его с обновлённым элементом
  const filteredTodos = todos.filter(todo => todo.id !== '1')
  return [...filteredTodos, updatedTodo]
// Since the API already gives us the updated information,
// we don't need to revalidate here.
},　{ revalidate: false })
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

## Связывание мутации

Объект SWR, возвращаемый `useSWR`, также содержит функцию `mutate()`, которая предварительно привязана к ключу SWR.

Функционально она эквивалентна глобальной функции `mutate`, но не требует параметра `key`.

```jsx
import useSWR from 'swr'

function Profile () {
  const { data, mutate } = useSWR('/api/user', fetcher)

  return (
    <div>
      <h1>Меня зовут {data.name}.</h1>
      <button onClick={async () => {
        const newName = data.name.toUpperCase()
        // отправьте API запрос для обновления данных
        await requestUpdateUsername(newName)
        // немедленно обновите локальные данные и ревалидируйте их (повторная выборка)
        // ПРИМЕЧАНИЕ: ключ не требуется при использовании мутации useSWR, поскольку он предварительно привязан
        mutate({ ...data, name: newName })
      }}>Перевести моё имя в верхний регистр!</button>
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

- `key`:  same as `useSWR`'s `key`
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
  const { trigger } = useSWRMutation('/api/user', sendRequest, /* options */)

  return (
    <button
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
  const { data: user, trigger } = useSWR('/api/user', fetcher);

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
