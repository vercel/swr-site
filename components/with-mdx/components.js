import { useEffect, useRef, useCallback } from 'react'
import NextLink from 'next/link'
import { useInView } from 'react-intersection-observer'
import 'intersection-observer'
import styles from './with-mdx.module.css'

const Video = ({ src, caption }) => {
  const [inViewRef, inView] = useInView({
    threshold: 1,
  })
  const videoRef = useRef()

  const setRefs = useCallback(
    (node) => {
      // Ref's from useRef needs to have the node assigned to `current`
      videoRef.current = node
      // Callback refs, like the one from `useInView`, is a function that takes the node as an argument
      inViewRef(node)

      if (node) {
        node.addEventListener('click', function () {
          if (this.paused) {
            this.play()
          } else {
            this.pause()
          }
        })
      }
    },
    [inViewRef]
  )

  useEffect(() => {
    if (!videoRef || !videoRef.current) {
      return
    }

    if (inView) {
      videoRef.current.play()
    } else {
      videoRef.current.pause()
    }
  }, [inView])

  return (
    <figure>
      <video loop muted autoPlay playsInline ref={setRefs}>
        <source src={src} type="video/mp4" />
      </video>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

const InlineCode = (props) => <code className={styles.inline} {...props} />

const Link = ({ href, children }) => {
  const isAbsolute = /^https?:\/\/|^\/\//i.test(href)

  if (isAbsolute) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }

  return (
    <NextLink href={href}>
      <a>{children}</a>
    </NextLink>
  )
}

const H3 = ({ children }) => {
  const hash = children.trim().toLowerCase().replace(/ /g, '-')

  return (
    <h3 id={hash}>
      <Link href={'#' + hash}>{children}</Link>
    </h3>
  )
}

export default {
  Video,
  h3: H3,
  inlineCode: InlineCode,
  a: Link,
}
