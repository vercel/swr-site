import Callout from 'nextra-theme-docs/callout'

# Uso con Next.js

## Obtención de datos del lado del cliente

Si su página contiene datos que se actualizan con frecuencia y no necesita renderizar previamente los datos, SWR se adapta perfectamente y no se necesita una configuración especial: solo importe `useSWR` y use el hook dentro de cualquier componente que use los datos.

Así es como funciona:

- En primer lugar, muestre inmediatamente la página sin datos. Puede mostrar un loading state para los datos que faltan.

- A continuación, se obtienen los datos en el lado del cliente y se muestran cuando están listos.

Este enfoque funciona bien, por ejemplo, para páginas que son dashboard. Dado que un dashboard es una página privada y específica del usuario, el SEO no es relevante y la página no necesita ser pre-rendering. Los datos se actualizan con frecuencia, lo que requiere la obtención de datos en el momento de la solicitud.

## Pre-rendering

Si la página debe ser pre-rendering, Next.js soporta [2 formas de pre-rendering](https://nextjs.org/docs/basic-features/data-fetching):  
**Static Generation (SSG)** y **Server-side Rendering (SSR)**.

Junto con SWR, puede hacer pre-rendering la página para el SEO, y también tener características como el almacenamiento en caché, revalidation, el focus tracking, refetching on interval en el lado del cliente.

Puedes pasar los pre-fetched data como valor inicial a la opción `initialData`. Por ejemplo, junto con [`getStaticProps`](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation):

```jsx
 export async function getStaticProps() {
  // `getStaticProps` se invoca en el lado del servidor,
  //  por lo que esta función `fetcher` se ejecutará en el server-side.
  const posts = await fetcher('https://jsonplaceholder.typicode.com/posts')
  return { props: { posts } }
}

function Posts (props) {
  // Aquí la función `fetcher` se ejecutará en el client-side.
  const { data } = useSWR('/api/posts', fetcher, { initialData: props.posts })

  // ...
}
```

La página sigue siendo pre-rendered. Eso significa que es amigable con el SEO, puede ser cacheada y se accede a ella muy rápido. Pero después de la hidratación, también es totalmente alimentado por SWR en el lado del cliente. Lo que significa que los datos pueden ser dinámicos y actualizarse con el tiempo y las interacciones del usuario.

<Callout emoji="💡">
   En el ejemplo anterior, <code>fetcher</code> se utiliza para cargar los datos tanto del cliente como del servidor, 
   y tiene que soportar ambos entornos. Pero esto no es un requisito. Puedes utilizar diferentes formas de cargar los datos desde el servidor o desde el cliente.
</Callout>


