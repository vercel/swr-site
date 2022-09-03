# Мутация

```js
mutate(key, data, options)
```

## Опции

- `optimisticData`: данные для немедленного обновления кеша клиента, обычно используемые в оптимистичном UI.
- `revalidate`: должен ли кеш повторно проверяться после разрешения асинхронного обновления.
- `populateCache`: should the result of the remote mutation be written to the cache, or a function that receives new result and current result as arguments and returns the mutation result.
- `rollbackOnError`: следует ли выполнять откат кеша в случае ошибок удаленной мутации.

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

## Возвращенные данные из мутации

Скорее всего, вам понадобятся данные для обновления кеша. Данные разрешаются или возвращаются из промиса или асинхронной функции, переданной в `mutate`.

Функция, переданная в `mutate`, вернёт обновлённый документ, который используется для обновления соответствующего значения кеша. Если при выполнении функции выбрасывается ошибка, она будет выведена, чтобы её можно было обработать должным образом.

```jsx
try {
  const user = await mutate('/api/user', updateUser(newUser))
} catch (error) {
  // Обработайте ошибку здесь при обновлении пользователя
}
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
