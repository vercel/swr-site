# Búsqueda Condicional

## Condicional

Utilice `null` o pase una función como `key` para obtener datos de forma condicional. 
Si la función lanza o devuelve un falsy value, SWR no iniciará la petición.


```js
// conditionally fetch
const { data } = useSWR(shouldFetch ? '/api/data' : null, fetcher)

// ...o devuelve un falsy value
const { data } = useSWR(() => shouldFetch ? '/api/data' : null, fetcher)

// ...o lanza un error cuando user.id no está definifo
const { data } = useSWR(() => '/api/data?uid=' + user.id, fetcher)
```

## Dependiente

SWR también permite obtener datos que dependen de otros datos. Garantiza el máximo paralelismo posible (evitando las cascadas), así como la obtención en serie cuando se necesita un dato dinámico para que se produzca la siguiente obtención de datos.

```js
function MyProjects () {
  const { data: user } = useSWR('/api/user')
  const { data: projects } = useSWR(() => '/api/projects?uid=' + user.id)
  // Al pasar una función, SWR utilizará el valor devuelto
  // como `key`. Si la función lanza o devuelve
  // falsy, SWR sabrá que algunas dependencias no estan
  // ready. En este caso `user.id` lanza cuando `user`
  // no este cargado.

  if (!projects) return 'loading...'
  return 'You have ' + projects.length + ' projects'
}
```
