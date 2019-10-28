export default ({ text, icon }) => {
  return (
    <div>
      {icon}
      <h4>{text}</h4>
      <style jsx>{`
        div {
          flex: 0 0 260px;
          align-items: center;
          display: inline-flex;
          padding: 0 0.5rem 1.5rem;
        }
        h4 {
          margin: 0 0 0 0.5rem;
          font-weight: 700;
          font-size: 0.95rem;
          white-space: nowrap;
        }
      `}</style>
    </div>
  )
}
