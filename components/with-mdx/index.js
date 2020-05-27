import { MDXProvider } from '@mdx-js/react'
import components from './components'
import styles from './with-mdx.module.css'

export default ({ children }) => (
  <MDXProvider components={components}>
    <main className={styles.root}>{children}</main>
  </MDXProvider>
)
