# Mutação

```js
mutate(key, data, options)
```

## Opções

- `optimisticData`: dados para serem atualizados imediatamente no cache do cliente, comumente usado para UI otimista.
- `revalidate`: se o cache deve revalidar quando a atualização assíncrona resolve.
- `populateCache`: should the result of the remote mutation be written to the cache, or a function that receives new result and current result as arguments and returns the mutation result.
- `rollbackOnError`: se o cache deve reverter se a mutação remota falhar.

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

## Data Retornada da Mutação

Mais provavelmente, você precisa de algum dado para atualizar o cache. O dado é resolvido ou retornado da função ou função assíncrona que você passou para `mutate`.

A função passada para `mutate` retornará um documento atualizado que é usado para atualizar o valor correspondente no cache. Se houver um erro ao executar a função, o erro será lançado para que possa ser tratado adequadamente.

```jsx
try {
  const user = await mutate('/api/user', updateUser(newUser))
} catch (error) {
  // Lide com um erro enquanto atualiza o usuário aqui
}
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
