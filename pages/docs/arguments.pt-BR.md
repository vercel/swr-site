# Argumentos

Por padrão, `key` será passado para `fetcher` como argumento. Então as 3 expressões a seguir são equivalentes:

```js
useSWR('/api/user', () => fetcher('/api/user'))
useSWR('/api/user', url => fetcher(url))
useSWR('/api/user', fetcher)
```

## Múltiplos Argumentos

Em alguns cenários, é útil passar vários argumentos (pode ser qualquer valor ou objeto) para a função `fetcher`.
Por exemplo, uma requisição de fetch autorizada:

```js
useSWR('/api/user', url => fetchWithToken(url, token))
```

Isso é **incorreto**. Porque o identificador (também a cache key) do dado é `'/api/user'`,
mesmo se `token` mudar, SWR ainda usará a mesma chave e retornará o dado errado.

Ao invés disso, você pode usar um array como o parâmetro `key`, que contém vários argumentos para a função `fetcher`.

```js
const { data: user } = useSWR(['/api/user', token], fetchWithToken)
```

A função `fetcherWithToken` ainda aceita os mesmos 2 argumentos, mas a cache key será associada com `token` agora.

## Passando Objetos

import Callout from 'nextra-theme-docs/callout'

<Callout>
  Desde a versão 1.1.0, chaves de objeto serão serializadas por baixo dos panos automaticamente. 
</Callout>
  
Digamos que você tenha outra função que busca dados com um escopo de usuário: `fetchWithUser(api, user)`. Você pode fazer o seguinte:

```js
const { data: user } = useSWR(['/api/user', token], fetchWithToken)

// ...e então passá-lo como argumento para outro hook useSWR
const { data: orders } = useSWR(user ? ['/api/orders', user] : null, fetchWithUser)
```

Você pode passar diretamente um objeto como chave, e `fetcher` receberá esse objeto também:

```js
const { data: orders } = useSWR({ url: '/api/orders', args: user }, fetcher)
```

<Callout emoji="⚠️">
  Em versões antigas (< 1.1.0), SWR compara os argumentos  **superficialmente** em cada renderização e aciona a revalidação se algum deles foi alterado.
</Callout>
