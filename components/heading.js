export default ({ children }) => {
  const hash = children.trim().toLowerCase().replace(/ /g, '-')
  return <a href={'#' + hash} id={hash}>
    <h3>{children}</h3>
    <style jsx>{`
      h3 {
        font-size: 1.25rem;
        letter-spacing: -0.02rem;
      }
      a {
        color: inherit;
        text-decoration: none;
      }
    `}</style>
  </a>
}
