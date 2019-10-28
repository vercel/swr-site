import Feature from './feature'

export default () => (
  <>
    <Feature
      text="Lightweight"
      icon={
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          shapeRendering="geometricPrecision"
          style={{ color: 'var(--geist-foreground)' }}
        >
          <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
        </svg>
      }
    />
    <Feature
      text="Backend agnostic"
      icon={
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          shapeRendering="geometricPrecision"
        >
          <path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25" />
          <path d="M8 16h.01" />
          <path d="M8 20h.01" />
          <path d="M12 18h.01" />
          <path d="M12 22h.01" />
          <path d="M16 16h.01" />
          <path d="M16 20h.01" />
        </svg>
      }
    />
    <Feature
      text="Realtime"
      icon={
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          shapeRendering="geometricPrecision"
          viewBox="0 0 24 24"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
        </svg>
      }
    />
    <Feature
      text="JAMstack oriented"
      icon={
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          shapeRendering="geometricPrecision"
          viewBox="0 0 24 24"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
      }
    />
    <Feature
      text="Suspense"
      icon={
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          shapeRendering="geometricPrecision"
          viewBox="0 0 24 24"
        >
          <path fill="var(--geist-fill)" d="M6 4H10V20H6z"></path>
          <path fill="var(--geist-fill)" d="M14 4H18V20H14z"></path>
        </svg>
      }
    />
    <Feature
      text="TypeScript ready"
      icon={
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          shapeRendering="geometricPrecision"
          viewBox="0 0 24 24"
        >
          <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path>
          <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"></path>
        </svg>
      }
    />
    <Feature
      text="REST compatible"
      icon={
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          shapeRendering="geometricPrecision"
          viewBox="0 0 24 24"
        >
          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
        </svg>
      }
    />
    <Feature
      text="Remote + Local"
      icon={
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          shapeRendering="geometricPrecision"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="2"></circle>
          <path d="M16.24 7.76a6 6 0 010 8.49m-8.48-.01a6 6 0 010-8.49m11.31-2.82a10 10 0 010 14.14m-14.14 0a10 10 0 010-14.14"></path>
        </svg>
      }
    />
  </>
)
