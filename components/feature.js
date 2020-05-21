const Feature = ({ text, icon }) => (
  <div>
    {icon}
    <h4>{text}</h4>

    <style jsx>{`
      div {
        flex: 0 0 25%;
        align-items: center;
        display: inline-flex;
        padding: 0 0.5rem 1.5rem;
        margin: 0 auto;
      }

      h4 {
        margin: 0 0 0 0.5rem;
        font-weight: 700;
        font-size: 0.95rem;
        white-space: nowrap;
      }

      @media (max-width: 600px) {
        div {
          flex-basis: auto;
          padding-left: 0;
        }

        h4 {
          font-size: 0.75rem;
        }
      }
    `}</style>
  </div>
)

export default Feature
