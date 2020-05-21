import Vercel from 'components/vercel'

const Footer = () => (
  <footer>
    <a
      href="https://vercel.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Made by Vercel"
    >
      <Vercel />
    </a>

    <style jsx>{`
      footer {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: calc(3 * var(--gap-double)) auto;
      }
    `}</style>
  </footer>
)

export default Footer
