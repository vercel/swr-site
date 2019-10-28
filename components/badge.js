export default ({ demo, api, link }) => {
  return (
    <a href={link} target="_blank">
      <div>{demo ? 'demo' : 'API'}</div>
      <style jsx>{`
        a {
          float: right;
          color: #0076ff;
          text-decoration: none;
        }
        div {
        }
      `}</style>
    </a>
  )
}
