# Argumentos

Por defecto, `key` se pasará a `fetcher` como argumento. Así que las siguientes 3 expresiones son equivalentes:

```js
useSWR('/api/user', () => fetcher('/api/user'))
useSWR('/api/user', url => fetcher(url))
useSWR('/api/user', fetcher)
```

## Argumentos múltiples

En algunos escenarios, es útil pasar múltiples argumentos (puede pasar cualquier valor u objeto) a
la función `fetcher`. Por ejemplo una solicitud de obtención autorizada:

```js
useSWR('/api/user', url => fetchWithToken(url, token))
```

Esto es **incorrecto**. Dado que el identificador (también la key del caché) de los datos es `'/api/user'`, incluso si el token cambia, SWR seguirá utilizando la misma key y devolverá los datos incorrectos.

En su lugar, puedes utilizar un **array** como parámetro `key`, que contiene múltiples argumentos de `fetcher`:

```js
const { data: user } = useSWR(['/api/user', token], fetchWithToken)
```

La función `fetchWithToken` sigue aceptando los mismo 2 argumentos, pero ahora la key del caché también estará asociada al `token`.

## Pasar objectos

Digamos que tienes otra función que obtiene datos con un scope 
del usuario: `fetchWithUser(api, user)`. Puedes hacer lo siguiente:

```js
const { data: user } = useSWR(['/api/user', token], fetchWithToken)
// ...y pasarlo como un argumento a otra query
const { data: orders } = useSWR(user ? ['/api/orders', user] : null, fetchWithUser)
```
La `key` de la solicitud es ahora la combinación de ambos valores. SWR **shallowly** compara los argumentos en cada renderización, 
y activa la revalidación si alguno de ellos ha cambiado.

Ten en cuenta que no debes recrear los objetos al renderizar, ya que serán tratados como objetos diferentes en cada render:

```js
// No lo hagas. Los deps se cambiarán en cada render.
useSWR(['/api/user', { id }], query)

// En su lugar, sólo debe pasar valores "estables".
useSWR(['/api/user', id], (url, id) => query(url, { id }))
```

Dan Abramov explica muy bien las dependencias en [está entrada del blog](https://overreacted.io/a-complete-guide-to-useeffect/#but-i-cant-put-this-function-inside-an-effect).

